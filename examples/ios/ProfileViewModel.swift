// Paired with: agents/ios/swift-reviewer/agent.md
// This file contains intentional issues for the Swift reviewer agent to find.
// Do not use this as production code.

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
        DispatchQueue.global().asyncAfter(deadline: .now() + 2) {
            completion(true)
        }
    }
}

class ProfileViewModel: ObservableObject {
    @Published var user: User?
    @Published var error: String?

    let service = ProfileService()

    func loadUser(id: String) {
        service.fetchUser(id: id) { result in
            switch result {
            case .success(let user):
                self.user = user
            case .failure(let error):
                self.error = error.localizedDescription
            }
        }
    }

    func uploadAvatar(image: UIImage) {
        let data = image.jpegData(compressionQuality: 1.0)!
        service.upload(data: data) { [unowned self] success in
            if success { self.user?.avatarUpdated = true }
        }
    }
}
