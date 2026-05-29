# Prompt — Unreal Blueprint to C++

**Platform:** Unreal Engine  
**Category:** Game Development  
**Type:** one-shot

---

## Purpose

Converts an Unreal Engine Blueprint logic description to equivalent C++ (UE5 API). Includes the full header and implementation file.

---

## Prompt

```
You are a senior Unreal Engine engineer. Convert the Blueprint logic described below to
production-quality C++.

Rules:
1. Output both the .h header and .cpp implementation file.
2. Use UE5 API conventions: TObjectPtr, FString, UPROPERTY, UFUNCTION, etc.
3. For Blueprint-exposed properties: use UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "...")
4. For Blueprint-callable functions: use UFUNCTION(BlueprintCallable, Category = "...")
5. Replace Event Tick logic with timers (GetWorldTimerManager().SetTimer) where appropriate.
6. Replace direct cast chains (Cast To Blueprint nodes) with interface checks or TryGetPawnOwner patterns.
7. Add a // Blueprint equivalent comment above any non-obvious C++ that replaces a Blueprint node.
8. State any assumptions you make about missing type information.

Blueprint to convert:
ACTOR_CLASS: [e.g. BP_EnemyCharacter extends ACharacter]
UE_VERSION: [e.g. 5.4]
DESCRIPTION:
[Describe the Blueprint event graph step by step]
```

---

## Example Usage

**What you paste:**
```
ACTOR_CLASS: BP_Pickup extends AActor
UE_VERSION: 5.4
DESCRIPTION:
On BeginPlay: set a rotating timer every 0.05 seconds.
On timer fire: add 2 degrees to the actor's Z rotation (yaw) — makes the pickup spin.
On ActorBeginOverlap with a Pawn:
  1. Cast to BP_PlayerCharacter.
  2. If cast succeeds, call AddCoins(10) on the player.
  3. Play a pickup sound (SoundCue asset reference).
  4. Destroy self.
```

**Expected output:**
```cpp
// APickup.h
#pragma once
#include "CoreMinimal.h"
#include "GameFramework/Actor.h"
#include "Pickup.generated.h"

UCLASS()
class MYGAME_API APickup : public AActor
{
    GENERATED_BODY()

public:
    APickup();

protected:
    virtual void BeginPlay() override;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Pickup")
    TObjectPtr<USoundCue> PickupSound;

    UPROPERTY(EditAnywhere, BlueprintReadWrite, Category = "Pickup")
    int32 CoinValue = 10;

private:
    FTimerHandle RotationTimerHandle;

    UFUNCTION()
    void RotateTick();

    UFUNCTION()
    void OnActorOverlap(
        AActor* OverlappedActor,
        AActor* OtherActor
    );
};

// APickup.cpp
#include "Pickup.h"
#include "PlayerCharacter.h"  // assumes BP_PlayerCharacter maps to APlayerCharacter
#include "Kismet/GameplayStatics.h"
#include "Components/SphereComponent.h"

APickup::APickup()
{
    PrimaryActorTick.bCanEverTick = false;  // using timer instead of Tick
    // Set up overlap collision...
}

void APickup::BeginPlay()
{
    Super::BeginPlay();

    // Blueprint equivalent: Set Timer by Function Name (0.05s, looping)
    GetWorldTimerManager().SetTimer(
        RotationTimerHandle,
        this,
        &APickup::RotateTick,
        0.05f,
        true
    );

    OnActorBeginOverlap.AddDynamic(this, &APickup::OnActorOverlap);
}

void APickup::RotateTick()
{
    // Blueprint equivalent: AddActorLocalRotation (Yaw +2 degrees)
    AddActorLocalRotation(FRotator(0.f, 2.f, 0.f));
}

void APickup::OnActorOverlap(AActor* OverlappedActor, AActor* OtherActor)
{
    // Blueprint equivalent: Cast To BP_PlayerCharacter
    if (APlayerCharacter* Player = Cast<APlayerCharacter>(OtherActor))
    {
        Player->AddCoins(CoinValue);

        // Blueprint equivalent: Play Sound at Location
        if (PickupSound)
        {
            UGameplayStatics::PlaySoundAtLocation(this, PickupSound, GetActorLocation());
        }

        // Blueprint equivalent: Destroy Actor
        GetWorldTimerManager().ClearTimer(RotationTimerHandle);
        Destroy();
    }
}
```

---

## Variations

- **Interface instead of Cast:** Add "Replace the Cast To PlayerCharacter with an interface check using UInterface for loose coupling."
- **With GameplayAbilitySystem:** Add "AddCoins should grant a GAS GameplayEffect instead of calling a direct function."
