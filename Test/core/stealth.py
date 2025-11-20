"""
Anti-detection system with human-like behavior simulation.
"""

import asyncio
import random
import time
from typing import Optional, Dict, Any
from playwright.async_api import Page
from config.settings import get_settings
from utils.logger import get_logger
from utils.helpers import random_delay


class StealthManager:
    """Manages anti-detection and stealth features."""
    
    def __init__(self):
        self.settings = get_settings()
        self.logger = get_logger(__name__)
        self.mouse_trajectory = []
        self.scroll_history = []
    
    async def apply_stealth_features(self, page: Page):
        """Apply comprehensive stealth features to a page."""
        try:
            # Override navigator properties
            await self._override_navigator_properties(page)
            
            # Override webdriver detection
            await self._override_webdriver_detection(page)
            
            # Override automation indicators
            await self._override_automation_indicators(page)
            
            # Override timing attacks
            await self._override_timing_attacks(page)
            
            # Override canvas fingerprinting
            await self._override_canvas_fingerprinting(page)
            
            # Override WebRTC fingerprinting
            await self._override_webrtc_fingerprinting(page)
            
            self.logger.debug("Applied stealth features to page")
            
        except Exception as e:
            self.logger.error(f"Failed to apply stealth features: {e}")
    
    async def _override_navigator_properties(self, page: Page):
        """Override navigator properties to appear more human."""
        await page.evaluate("""
        () => {
            // Override webdriver property
            Object.defineProperty(navigator, 'webdriver', {
                get: () => undefined,
            });
            
            // Override plugins
            Object.defineProperty(navigator, 'plugins', {
                get: () => {
                    return [
                        {
                            0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format", enabledPlugin: Plugin},
                            description: "Portable Document Format",
                            filename: "internal-pdf-viewer",
                            length: 1,
                            name: "Chrome PDF Plugin"
                        },
                        {
                            0: {type: "application/pdf", suffixes: "pdf", description: "", enabledPlugin: Plugin},
                            description: "",
                            filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
                            length: 1,
                            name: "Chrome PDF Viewer"
                        },
                        {
                            0: {type: "application/x-nacl", suffixes: "", description: "Native Client Executable", enabledPlugin: Plugin},
                            1: {type: "application/x-pnacl", suffixes: "", description: "Portable Native Client Executable", enabledPlugin: Plugin},
                            description: "",
                            filename: "internal-nacl-plugin",
                            length: 2,
                            name: "Native Client"
                        }
                    ];
                },
            });
            
            // Override languages
            Object.defineProperty(navigator, 'languages', {
                get: () => ['en-US', 'en'],
            });
            
            // Override platform
            Object.defineProperty(navigator, 'platform', {
                get: () => 'Win32',
            });
            
            // Override hardware concurrency
            Object.defineProperty(navigator, 'hardwareConcurrency', {
                get: () => 4,
            });
            
            // Override device memory
            Object.defineProperty(navigator, 'deviceMemory', {
                get: () => 8,
            });
        }
        """)
    
    async def _override_webdriver_detection(self, page: Page):
        """Override webdriver detection methods."""
        await page.evaluate("""
        () => {
            // Remove webdriver property
            delete window.navigator.webdriver;
            
            // Override getParameter to hide automation
            const getParameter = WebGLRenderingContext.getParameter;
            WebGLRenderingContext.prototype.getParameter = function(parameter) {
                if (parameter === 37445) {
                    return 'Intel Inc.';
                }
                if (parameter === 37446) {
                    return 'Intel Iris OpenGL Engine';
                }
                return getParameter(parameter);
            };
            
            // Override chrome runtime
            window.chrome = {
                runtime: {
                    onConnect: undefined,
                    onMessage: undefined,
                },
            };
            
            // Override permissions API
            const originalQuery = window.navigator.permissions.query;
            window.navigator.permissions.query = (parameters) => (
                parameters.name === 'notifications' ?
                    Promise.resolve({ state: Notification.permission }) :
                    originalQuery(parameters)
            );
        }
        """)
    
    async def _override_automation_indicators(self, page: Page):
        """Override automation detection indicators."""
        await page.evaluate("""
        () => {
            // Override automation indicators
            Object.defineProperty(window, 'outerHeight', {
                get: () => window.innerHeight,
            });
            
            Object.defineProperty(window, 'outerWidth', {
                get: () => window.innerWidth,
            });
            
            // Override screen properties
            Object.defineProperty(screen, 'availHeight', {
                get: () => screen.height,
            });
            
            Object.defineProperty(screen, 'availWidth', {
                get: () => screen.width,
            });
            
            // Override date timezone
            const originalDate = Date;
            Date = class extends originalDate {
                getTimezoneOffset() {
                    return -300; // EST timezone
                }
            };
        }
        """)
    
    async def _override_timing_attacks(self, page: Page):
        """Override timing-based detection methods."""
        await page.evaluate("""
        () => {
            // Override performance timing
            const originalNow = performance.now;
            let startTime = originalNow();
            
            performance.now = function() {
                return originalNow() + Math.random() * 0.1;
            };
            
            // Override Date.now for timing consistency
            const originalDateNow = Date.now;
            Date.now = function() {
                return originalDateNow() + Math.random() * 0.1;
            };
        }
        """)
    
    async def _override_canvas_fingerprinting(self, page: Page):
        """Override canvas fingerprinting techniques."""
        await page.evaluate("""
        () => {
            const originalToDataURL = HTMLCanvasElement.prototype.toDataURL;
            HTMLCanvasElement.prototype.toDataURL = function() {
                const context = this.getContext('2d');
                if (context) {
                    // Add slight noise to canvas
                    const imageData = context.getImageData(0, 0, this.width, this.height);
                    const data = imageData.data;
                    for (let i = 0; i < data.length; i += 4) {
                        if (Math.random() < 0.01) {
                            data[i] = Math.floor(Math.random() * 255);
                            data[i + 1] = Math.floor(Math.random() * 255);
                            data[i + 2] = Math.floor(Math.random() * 255);
                        }
                    }
                    context.putImageData(imageData, 0, 0);
                }
                return originalToDataURL.apply(this, arguments);
            };
        }
        """)
    
    async def _override_webrtc_fingerprinting(self, page: Page):
        """Override WebRTC fingerprinting."""
        await page.evaluate("""
        () => {
            // Override RTCPeerConnection
            const originalRTCPeerConnection = window.RTCPeerConnection;
            window.RTCPeerConnection = function() {
                const pc = new originalRTCPeerConnection();
                const originalCreateDataChannel = pc.createDataChannel;
                pc.createDataChannel = function() {
                    return originalCreateDataChannel.apply(this, arguments);
                };
                return pc;
            };
        }
        """)
    
    async def simulate_human_behavior(self, page: Page):
        """Simulate human-like behavior patterns."""
        try:
            # Random mouse movements
            await self._simulate_mouse_movements(page)
            
            # Random scrolling
            await self._simulate_scrolling(page)
            
            # Random pauses
            await self._simulate_pauses()
            
            # Random keyboard events
            await self._simulate_keyboard_events(page)
            
        except Exception as e:
            self.logger.debug(f"Error simulating human behavior: {e}")
    
    async def _simulate_mouse_movements(self, page: Page):
        """Simulate random mouse movements."""
        try:
            # Get viewport size
            viewport = page.viewport_size
            if not viewport:
                return
            
            # Generate random mouse movements
            for _ in range(random.randint(2, 5)):
                x = random.randint(0, viewport['width'])
                y = random.randint(0, viewport['height'])
                
                await page.mouse.move(x, y)
                await asyncio.sleep(random.uniform(0.1, 0.3))
                
        except Exception as e:
            self.logger.debug(f"Error simulating mouse movements: {e}")
    
    async def _simulate_scrolling(self, page: Page):
        """Simulate human-like scrolling behavior."""
        try:
            # Get page height
            page_height = await page.evaluate("document.body.scrollHeight")
            viewport_height = await page.evaluate("window.innerHeight")
            
            if page_height <= viewport_height:
                return
            
            # Simulate scrolling down
            current_scroll = 0
            while current_scroll < page_height - viewport_height:
                # Random scroll distance
                scroll_distance = random.randint(100, 400)
                current_scroll += scroll_distance
                
                # Scroll to position
                await page.evaluate(f"window.scrollTo(0, {current_scroll})")
                
                # Random pause
                await asyncio.sleep(random.uniform(0.5, 2.0))
                
                # Sometimes scroll back up (human behavior)
                if random.random() < 0.15:
                    back_scroll = random.randint(50, 150)
                    current_scroll = max(0, current_scroll - back_scroll)
                    await page.evaluate(f"window.scrollTo(0, {current_scroll})")
                    await asyncio.sleep(random.uniform(0.2, 0.8))
            
            # Scroll back to top
            await page.evaluate("window.scrollTo(0, 0)")
            
        except Exception as e:
            self.logger.debug(f"Error simulating scrolling: {e}")
    
    async def _simulate_pauses(self):
        """Simulate random pauses."""
        pause_duration = random.uniform(0.5, 3.0)
        await asyncio.sleep(pause_duration)
    
    async def _simulate_keyboard_events(self, page: Page):
        """Simulate random keyboard events."""
        try:
            # Random key presses (Ctrl, Alt, etc.)
            keys = ['Control', 'Alt', 'Shift', 'Meta']
            if random.random() < 0.1:  # 10% chance
                key = random.choice(keys)
                await page.keyboard.down(key)
                await asyncio.sleep(random.uniform(0.1, 0.5))
                await page.keyboard.up(key)
                
        except Exception as e:
            self.logger.debug(f"Error simulating keyboard events: {e}")
    
    async def randomize_timing(self, base_delay: float = 1.0) -> float:
        """Add randomization to timing delays."""
        # Add 20-50% randomization
        variation = random.uniform(0.8, 1.5)
        return base_delay * variation
    
    async def simulate_typing(self, page: Page, selector: str, text: str):
        """Simulate human-like typing."""
        try:
            element = await page.query_selector(selector)
            if not element:
                return
            
            await element.click()
            await asyncio.sleep(random.uniform(0.1, 0.3))
            
            # Type with random delays between characters
            for char in text:
                await page.keyboard.type(char)
                await asyncio.sleep(random.uniform(0.05, 0.2))
                
        except Exception as e:
            self.logger.debug(f"Error simulating typing: {e}")
    
    def get_stealth_stats(self) -> Dict[str, Any]:
        """Get stealth simulation statistics."""
        return {
            'mouse_movements': len(self.mouse_trajectory),
            'scroll_events': len(self.scroll_history),
            'last_activity': time.time()
        }







