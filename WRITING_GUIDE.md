# Documentation Writing Guide

This guide defines the writing style and content treatment for Pamir/Distiller documentation.

## Core Philosophy

These docs serve as **product design documents** — handoffs from product to developers. They explain the **"why"** and the **user experience philosophy** behind architectural decisions.

### What We Do

✅ **Voice of the User**: Write from the user's perspective. Explain why the system behaves this way to create a better experience.

✅ **Abstract States**: Describe high-level system states and transitions, not UI components.

✅ **Design Logic**: Explain the necessity and rationale behind architectural choices.

✅ **User Mental Models**: Frame technical concepts as user perceptions (e.g., "The Invisible Guard" for hidden Bluetooth).

### What We Don't Do

❌ **No Implementation Details**: No code snippets, library names, or framework-specific instructions.

❌ **No UI Descriptions**: Developers can reference the demo app in git for UI specifics.

❌ **No Technical Directives**: Don't dictate stacks (e.g., "Use Core Bluetooth"). Focus on requirements.

---

## Document Structure

### 1. Opening Callout (Philosophy)
Every page starts with a product philosophy callout explaining the core principle.

**Example:**
```markdown
<Callout title="Product Philosophy">
  "The device must be self-healing." We assume Wi-Fi connectivity is ephemeral and fragile. The system is designed to provide a secure, frustration-free recovery path even when the device is completely offline and "headless".
</Callout>
```

### 2. High-Level Narrative
Introduce the concept with a user-centric story or journey.

**Example sections:**
- "The Connectivity Lifeline"
- "The Recovery Journey"
- "The Dual-Role Architecture"

### 3. States and Behaviors
Use tables to map technical states to user perceptions or roles.

**Device States Example:**
| State | User Perception | Information Goal |
| :--- | :--- | :--- |
| **Stable** | "It's working." | Show value. Don't distract. |
| **Hard Offline** | "I need help." | Call to Action. QR code dominant. |

**Design Behaviors Example:**
| Behavior | Logic & "Why" |
| :--- | :--- |
| **Auto-Discovery** | When offline, the device must shout... |

### 4. Key Principles or Rules
End with immutable design principles or "Golden Rules."

**Example:**
1. **Radio is ALWAYS ON**: The user cannot disable Bluetooth via the UI. It is the only path back from a "bricked" state.
2. **System Trumps User**: If Wi-Fi is lost, the System Role takes over immediately...

---

## Writing Style

### Voice and Tone
- **Conversational but authoritative**: "We employ a Dual-Mode Architecture..."
- **User-empathetic**: "The user should never feel 'stuck' in a bad state."
- **Declarative**: "This is the critical 'Voice of the User' moment."

### Terminology
- Use **metaphors** for abstract concepts: "The Invisible Guard", "The Connector", "The Safety Net"
- Frame states as **narratives**: "Stable State" → "Loss (Entropy)" → "Bridge" → "Restoration"
- Bold key terms on first use: **Dual-Mode Architecture**, **Smart Cache**, **Trust, but Verify**

### Structure Elements
- **Horizontal rules (`---`)** to separate major sections
- **Callouts** for philosophy/warnings
- **Tables** for states, behaviors, and comparisons
- **Bolded questions** for decision points: "**Why BLE?**"

---

## Content Treatment Examples

### ✅ Good (Product Design Focus)

```markdown
## Security Model: Trust, but Verify

Bluetooth is inherently promiscuous. Anyone nearby can see a discoverable device. Our security model acknowledges this reality.

### The Handshake (Open)
We allow *anyone* to initiate a BLE connection. This ensures that in an emergency, your phone can find the device instantly without struggling with OS-level pairing dialogs.

### The Gatekeeper (Locked)
Once connected, the device is **deaf** to commands until it receives the **Device Password**.
- **Can I change the Wi-Fi?** No (Password Required).
- **Can I reboot it?** No (Password Required).
```

### ❌ Bad (Implementation Details)

```markdown
## Security Implementation

Use the NoIoAgent pairing mode in BlueZ:

```python
from bluez_peripheral.gatt import Service
# Set up authentication...
```

Install dependencies:
```
npm i core-bluetooth
```
```

---

## Conversion from Specs

When converting HTML specs or detailed flows:

1. **Extract Core Logic**: Identify the "why" statements and design rationale
2. **Abstract the Flow**: Convert step-by-step instructions to user journey narrative
3. **Remove Noise**: Drop button labels, specific error codes, retry counts (unless conceptually important)
4. **Elevate to Philosophy**: Transform technical constraints into user-benefit statements

**Before (Spec):**
> The device scans for networks every 30 seconds. After 2 minutes, broadcast hotspot. Show error code E402 if auth fails.

**After (Design Doc):**
> **The Philosophy**: Do not panic immediately. Transients happen. The device retries silently for 2 minutes before escalating to a "Hard Offline" state.

---

## Maintenance

- Update this guide as the style evolves
- Reference this document when onboarding new documentation writers
- Use the existing WiFi, Bluetooth, and Onboarding pages as canonical examples
