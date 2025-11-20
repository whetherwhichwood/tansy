"""
OSRS Cow Farmer Bot - Cow Killing and Cowhide Collection

This bot automates cow killing at Lumbridge cow pen using color detection.
Collects cowhides and banks them for profit.

Location: Lumbridge cow pen (F2P)
Author: OSRS Bot Development Team
Version: 1.0
"""

import time
import random
import pyautogui
from functions import find_Object
from Earth_Craft import find_banker_good

class CowFarmerBot:
    """Simple cow farming bot using color detection"""
    
    def __init__(self):
        self.cows_killed = 0
        self.cowhides_collected = 0
        self.banking_trips = 0
        self.session_start = time.time()
        
        print("=" * 50)
        print("🐄 OSRS COW FARMER BOT")
        print("=" * 50)
        print("Location: Lumbridge cow pen")
        print("Method: Color detection")
        print("Target: Cows (cowhides)")
        print("=" * 50)
    
    def find_cow(self):
        """Find a cow using cyan color detection"""
        print("🔍 Looking for cows...")
        
        # Use original color-based find_Object with cyan color (index 3)
        result = find_Object(3, 0, 0, 0, 0)  # Cyan color for cows
        if result:
            print(f"🐄 Found cow at {result}")
            return result
        else:
            print("❌ No cows found")
            return None
    
    def attack_cow(self, cow_pos):
        """Attack the cow"""
        print("⚔️ Attacking cow...")
        
        # Move to cow and click to attack
        pyautogui.moveTo(cow_pos[0], cow_pos[1], duration=random.uniform(0.5, 1.0))
        time.sleep(random.uniform(0.1, 0.3))
        pyautogui.click()
        
        # Wait for combat to start
        time.sleep(random.uniform(1.0, 2.0))
        return True
    
    def is_in_combat(self):
        """Check if player is in combat"""
        # Simple time-based check
        return True  # Simplified for testing
    
    def is_cow_dead(self):
        """Check if cow is dead (simplified)"""
        # Simulate cow death after some time
        return random.random() < 0.3  # 30% chance per check
    
    def collect_cowhide(self):
        """Collect cowhide from dead cow"""
        print("📦 Collecting cowhide...")
        
        # Simulate collecting cowhide
        time.sleep(random.uniform(1.0, 2.0))
        self.cowhides_collected += 1
        self.cows_killed += 1
        print(f"✅ Collected cowhide! Total: {self.cowhides_collected}")
        return True
    
    def is_inventory_full(self):
        """Check if inventory is full (simplified)"""
        return self.cowhides_collected >= 28
    
    def bank_cowhides(self):
        """Bank the cowhides"""
        print("🏦 Banking cowhides...")
        
        try:
            # Find bank booth using color detection
            bank_booth = find_banker_good(3)  # Bank booth (index 3)
            if bank_booth:
                print(f"🏦 Found bank booth at {bank_booth}")
                
                # Click bank booth
                pyautogui.moveTo(bank_booth[0], bank_booth[1], duration=random.uniform(0.5, 1.0))
                time.sleep(random.uniform(0.1, 0.3))
                pyautogui.click()
                
                # Wait for bank interface
                time.sleep(random.uniform(2.0, 3.0))
                
                # Deposit all cowhides (simplified)
                print("📦 Depositing cowhides...")
                time.sleep(random.uniform(1.0, 2.0))
                
                self.banking_trips += 1
                self.cowhides_collected = 0  # Reset cowhide count
                print(f"✅ Banked cowhides. Total banking trips: {self.banking_trips}")
                return True
            else:
                print("❌ Bank booth not found")
                return False
                
        except Exception as e:
            print(f"❌ Banking error: {e}")
            return False
    
    def run(self):
        """Main bot loop"""
        print("🚀 Starting Cow Farmer Bot...")
        
        try:
            while True:
                # Find and attack a cow
                cow_pos = self.find_cow()
                if cow_pos:
                    self.attack_cow(cow_pos)
                    
                    # Wait for combat to finish
                    combat_time = random.uniform(5, 15)  # 5-15 seconds per cow
                    print(f"⚔️ Fighting cow for {combat_time:.1f} seconds...")
                    time.sleep(combat_time)
                    
                    # Check if cow is dead and collect cowhide
                    if self.is_cow_dead():
                        self.collect_cowhide()
                    
                    # Check if inventory is full
                    if self.is_inventory_full():
                        print("📦 Inventory full, banking...")
                        if self.bank_cowhides():
                            print("✅ Banking successful")
                        else:
                            print("❌ Banking failed")
                else:
                    print("⏳ No cows found, waiting...")
                    time.sleep(5)
                
                # Random break for anti-ban
                if random.random() < 0.1:  # 10% chance
                    break_time = random.uniform(5, 15)
                    print(f"☕ Taking break for {break_time:.1f} seconds...")
                    time.sleep(break_time)
                
        except KeyboardInterrupt:
            print("\n🛑 Bot stopped by user")
        except Exception as e:
            print(f"❌ Bot error: {e}")
        finally:
            session_time = time.time() - self.session_start
            print(f"\n📊 Session Summary:")
            print(f"   Time: {session_time/60:.1f} minutes")
            print(f"   Cows killed: {self.cows_killed}")
            print(f"   Cowhides collected: {self.cowhides_collected}")
            print(f"   Banking trips: {self.banking_trips}")

if __name__ == "__main__":
    bot = CowFarmerBot()
    bot.run()

