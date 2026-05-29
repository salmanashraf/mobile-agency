# Example Input — iOS Swift Code Reviewer

The `ProfileViewModel` below contains five intentional issues across memory safety, concurrency, and testability.

---

```
PLATFORM: iOS
SWIFT_VERSION: 5.10
SWIFTUI: true
FILE_PATH: Sources/Profile/ProfileViewModel.swift
CODE:
import Foundation
import UIKit
import Combine

struct User {
    var id: String
    var name: String
    var bio: String
    var avatarUpdated: Bool = false
}

protocol ProfileServiceProtocol {
    func fetchUser(id: String, completion: @escaping (Result<User, Error>) -> Void)
    func upload(data: Data, completion: @escaping (Bool) -> Void)
}

class ProfileService: ProfileServiceProtocol {
    func fetchUser(id: String, completion: @escaping (Result<User, Error>) -> Void) {
        DispatchQueue.global().asyncAfter(deadline: .now() + 1) {
            completion(.success(User(id: id, name: "Alice", bio: "Developer")))
        }
    }
    func upload(data: Data, completion: @escaping (Bool) -> Void) {
        DispatchQueue.global().asyncAfter(deadline: .now() + 2) { completion(true) }
    }
}

class ProfileViewModel: ObservableObject {
    @Published var user: User?
    @Published var error: String?

    let service = ProfileService()                             // issue 1

    func loadUser(id: String) {
        service.fetchUser(id: id) { result in                  // issue 2
            switch result {
            case .success(let user):
                self.user = user                               // issue 2b
            case .failure(let error):
                self.error = error.localizedDescription
            }
        }
    }

    func uploadAvatar(image: UIImage) {
        let data = image.jpegData(compressionQuality: 1.0)!   // issue 3
        service.upload(data: data) { [unowned self] success in // issue 4
            if success { self.user?.avatarUpdated = true }
        }
    }
}
```

---

## What to Expect

The agent identifies five issues. See [`example-output.md`](example-output.md) for the full report.

**Issue map:**
1. `service` declared as a concrete type (not protocol) — not injectable, not testable (WARNING)
2. Strong `self` capture in `fetchUser` completion — potential retain cycle (CRITICAL)
3. `@Published` properties mutated from background thread — data race (CRITICAL)
4. `jpegData(compressionQuality:)` force-unwrapped — crash if nil (CRITICAL)
5. `[unowned self]` in async upload callback — crash after deallocation (CRITICAL)

---

## Variations

### async/await migration candidate
```
PLATFORM: iOS
SWIFT_VERSION: 5.10
SWIFTUI: false
FILE_PATH: Sources/Network/OrderService.swift
CODE:
class OrderService {
    func fetchOrders(completion: @escaping ([Order]?, Error?) -> Void) {
        URLSession.shared.dataTask(with: ordersURL) { data, _, error in
            if let error = error { completion(nil, error); return }
            let orders = try? JSONDecoder().decode([Order].self, from: data!)
            completion(orders, nil)
        }.resume()
    }
}
```
Issues: optional error pattern (ambiguous — both can be nil), `try?` swallows errors, `data!` force-unwrap, completion handler API should be async.
