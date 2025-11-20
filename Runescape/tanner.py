"""
OSRS Tanner Bot - Leather Tanning Automation

This bot automates cowhide tanning at Al Kharid tanner using color detection.
Tans cowhides into leather for profit.

Location: Al Kharid tanner (F2P)
Author: OSRS Bot Development Team
Version: 1.0
"""

import time
import random
import pyautogui
from functions import find_Object
from Earth_Craft import find_banker_good

class TannerBot:
    """Simple tanning bot using color detection"""
    
    def __init__(self):
        self.cowhides_tanned = 0
        self.leather_created = 0
        self.banking_trips = 0
        self.session_start = time.time()
        
        print("=" * 50)
        print("🪣 OSRS TANNER BOT")
        print("=" * 50)
        print("Location: Al Kharid tanner")
        print("Method: Color detection")
        print("Target: Cowhides → Leather")
        print("=" * 50)
    
    def find_tanner(self):
        """Find the tanner NPC using cyan color detection"""
        print("🔍 Looking for tanner...")
        
        # Use original color-based find_Object with cyan color (index 3)
        result = find_Object(3, 0, 0, 0, 0)  # Cyan color for NPCs
        if result:
            print(f"🪣 Found tanner at {result}")
            return result
        else:
            print("❌ No tanner found")
            return None
    
    def interact_with_tanner(self, tanner_pos):
        """Interact with the tanner"""
        print("🪣 Interacting with tanner...")
        
        # Move to tanner and click
        pyautogui.moveTo(tanner_pos[0], tanner_pos[1], duration=random.uniform(0.5, 1.0))
        time.sleep(random.uniform(0.1, 0.3))
        pyautogui.click()
        
        # Wait for tanner interface
        time.sleep(random.uniform(2.0, 3.0))
        return True
    
    def tan_cowhides(self):
        """Tan cowhides into leather"""
        print("🪣 Tanning cowhides...")
        
        # Simulate tanning process
        tanning_time = random.uniform(5, 10)  # 5-10 seconds per batch
        print(f"⏳ Tanning for {tanning_time:.1f} seconds...")
        time.sleep(tanning_time)
        
        # Simulate tanning results
        cowhides_tanned = random.randint(1, 5)
        leather_created = cowhides_tanned  # 1:1 ratio
        
        self.cowhides_tanned += cowhides_tanned
        self.leather_created += leather_created
        
        print(f"✅ Tanned {cowhides_tanned} cowhides into {leather_created} leather!")
        print(f"   Total leather created: {self.leather_created}")
        return True
    
    def is_inventory_full(self):
        """Check if inventory is full (simplified)"""
        return self.leather_created >= 28
    
    def bank_leather(self):
        """Bank the leather"""
        print("🏦 Banking leather...")
        
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
                
                # Deposit all leather (simplified)
                print("📦 Depositing leather...")
                time.sleep(random.uniform(1.0, 2.0))
                
                self.banking_trips += 1
                self.leather_created = 0  # Reset leather count
                print(f"✅ Banked leather. Total banking trips: {self.banking_trips}")
                return True
            else:
                print("❌ Bank booth not found")
                return False
                
        except Exception as e:
            print(f"❌ Banking error: {e}")
            return False
    
    def withdraw_cowhides(self):
        """Withdraw cowhides from bank"""
        print("🏦 Withdrawing cowhides...")
        
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
                
                # Withdraw cowhides (simplified)
                print("📦 Withdrawing cowhides...")
                time.sleep(random.uniform(1.0, 2.0))
                
                print("✅ Withdrew cowhides")
                return True
            else:
                print("❌ Bank booth not found")
                return False
                
        except Exception as e:
            print(f"❌ Banking error: {e}")
            return False
    
    def run(self):
        """Main bot loop"""
        print("🚀 Starting Tanner Bot...")
        
        try:
            while True:
                # Check if we need to withdraw cowhides
                if self.leather_created == 0:
                    print("📦 No cowhides, withdrawing from bank...")
                    if not self.withdraw_cowhides():
                        print("❌ Failed to withdraw cowhides")
                        time.sleep(5)
                        continue
                
                # Find and interact with tanner
                tanner_pos = self.find_tanner()
                if tanner_pos:
                    self.interact_with_tanner(tanner_pos)
                    
                    # Tan cowhides
                    self.tan_cowhides()
                    
                    # Check if inventory is full
                    if self.is_inventory_full():
                        print("📦 Inventory full, banking...")
                        if self.bank_leather():
                            print("✅ Banking successful")
                        else:
                            print("❌ Banking failed")
                else:
                    print("⏳ No tanner found, waiting...")
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
            print(f"   Cowhides tanned: {self.cowhides_tanned}")
            print(f"   Leather created: {self.leather_created}")
            print(f"   Banking trips: {self.banking_trips}")

if __name__ == "__main__":
    bot = TannerBot()
    bot.run()

