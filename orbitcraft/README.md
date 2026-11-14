# OrbitCraft: Modular Systems Architect
> **NASA Space Apps Challenge 2026 Submission**  
> Interactive, browser-based spacecraft systems engineering and mission design simulator.

[![Live Demo](https://img.shields.io/badge/Demo-orbitcraft--plum.vercel.app-00dfa2?style=for-the-badge&logo=vercel)](https://orbitcraft-plum.vercel.app)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TailwindCSS%20%7C%20WebAudio-0284c7?style=for-the-badge)](https://github.com/vannn-cooder/orbitcraft)

---

## 🚀 Overview

**OrbitCraft** bridges the gap between oversimplified arcade space games and complex, inaccessible aerospace CAD tools. Designed under authentic systems engineering constraints, users step into the role of a Spacecraft Systems Architect tasked with balancing interdependent trade-offs across mass budgets, orbital delta-v ($\Delta v$), solar radiation flux, eclipse power storage, RF communications, and mission costs.

The platform provides a zero-barrier, zero-installation testbed to design, validate, and launch spacecraft across four progressive interplanetary mission envelopes:
1. **TerraWatch-1**: Sun-Synchronous Low Earth Orbit (LEO) Earth Observation.
2. **SeleneMapper**: Polar Lunar Reconnaissance & South Pole Mapping.
3. **AresAtmosphere**: Mars Aeronomy & Atmospheric Trace Gas Survey.
4. **Jovian Odyssey**: Deep-Space Outer Planet Exploration at Jupiter ($5.2\text{ AU}$).

---

## ⚡ Core Engineering & Physics Features

- **Tsiolkovsky Rocket Equation Engine**: Determines available velocity increments based on structural dry mass, propellant fractions, and engine Specific Impulse ($I_{\text{sp}}$):
  $$\Delta v = I_{\text{sp}} \cdot g_0 \cdot \ln\left(\frac{m_0}{m_f}\right)$$
- **Solar Radiation Inverse-Square Attenuation**: Calculates real photovoltaic power generation based on heliocentric distance ($1/r^2$), necessitating Radioisotope Thermoelectric Generators (RTGs) in deep space.
- **Orbital Eclipse Battery Dynamics**: Computes dark-pass discharge cycles using orbital period calculations to prevent spacecraft blackout.
- **RF Telemetry & Link Budgeting**: Manages onboard Solid-State Recorder (SSR) buffer dynamics against transmission downlink data rates to avoid data overflow.
- **2D Keplerian Orbital Trajectory Canvas**: Real-time orbital propagation plotting Apoapsis ($r_a$), Periapsis ($r_p$), and eccentricity using the Vis-Viva relation:
  $$v^2 = \mu \left(\frac{2}{r} - \frac{1}{a}\right)$$
- **Automated Flight Readiness Review (FRR)**: Real-time diagnostic console offering proactive systems advisories when facing engineering deficits.
- **Realistic Multi-Stage Launch Simulation**: Complete with Web Audio API rocket engine synthesis, aerodynamic Max-Q pressure alerts, Stage 1 booster separation, vacuum plume expansion, and payload fairing jettison.

---

## 🛠️ Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Physics & Audio**: Web Audio API (real-time low-frequency noise & telemetry tone synthesis)
- **Deployment**: Vercel Serverless Platform

---

## 📦 NASA Data & Literature Sources

1. **NASA Systems Engineering Handbook (SP-2016-6105 Rev 2)**: Design margin guidelines, subsystem allocation, and Flight Readiness Review gating processes.
2. **NASA Goddard Space Flight Center (GSFC) Planetary Fact Sheets**: Planetary radii, standard gravitational parameters ($\mu$), and solar irradiance constants.
3. **NASA SP-8000 Space Vehicle Design Criteria**: Launch vehicle acoustics, dynamic pressure profiles, and vacuum plume characteristics.

---

## 💻 Local Development Setup

To run OrbitCraft locally:

```bash
# 1. Clone the repository
git clone [https://github.com/vannn-cooder/orbitcraft.git](https://github.com/vannn-cooder/orbitcraft.git)

# 2. Enter project directory
cd orbitcraft

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev