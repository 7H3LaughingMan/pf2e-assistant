# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/)
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [7.9.1] - 2026-02-19

PF2e System v7.10.1 Update
SF2e System v0.0.4 Update

### Fixed

- Console Debug Spam

## [7.9.0] - 2026-01-21

PF2e System v7.9.1 Update
Began implementing some changes to support the SF2e System; however, further work can't be completed untill the PF2e Anachronism module is released.

### Added

- Axe Critical Specialization
- Brilliant Rune
- Crushing Grab
- Crushing Rune
- Fearsome Rune
- Frost Rune
- Grievous Rune
- Rooting Rune
- Shock Rune
- Thundering Rune
- Vitalizing Rune

## [7.8.3] - 2026-01-16

### Added

- Applereed Mutagen
- Boulderhead Bock
- Brewer's Regret
- Bronze Bull Pendant
- Cat's Eye Elixir
- Chivalric Emblem
- Cinnamon Seers
- Cloud Buns
- Cold Iron Blanch
- Covenant Tea
- Delve Scale
- Demortification Oil
- Diplomat's Charcuterie
- Discord Fulu
- Dragon Breath Scale
- Dragon Pearl
- Dragon Throat Scale
- Dragon's Blood Pudding
- Dragonfly Fulu
- Dragonfly Potion
- Drowsy Sun Eye Drops
- Elysian Dew
- Energized Cartridge
- Energizing Pill
- Energizing Tea
- Escape Fulu
- Ethereal Crescent
- Featherlight Fletching
- Feyfoul
- Fire and Iceberg
- Frost Breath
- Galvanic Chew
- Ghost Fowl Porridge
- Ghost Oil
- Ghostbane Fulu
- Ginger Chew
- Glow Rod
- Golden Breath Fulu
- Grindlegrub Steak
- Hand of Mercy
- Hydra Mutagen
- Ichthyosis Mutagen
- Impossible Cake
- Iron Medallion
- Iron Wine
- Lastwall Soup
- Life-Boosting Oil
- Malleable Mixture
- Mighty Counterweight
- Morph Jewel
- Mortalis Coin
- Necrotic Cap
- Ommatophoric Mutagen
- Pallesthetic Mutagen
- Phasing Trine
- Phoenix Flask
- Potion of Acid Resistance
- Potion of Cold Resistance
- Potion of Electricity Resistance
- Potion of Fire Resistance
- Potion of Flying
- Potion of Minute Echoes
- Potion of Quickness
- Potion of Sonic Resistance
- Potion of Stable Form
- Potion of Swimming
- Red-Rib Gill Mask
- Sense-Dulling Hood
- Shrinking Potion
- Silver Crescent
- Silver Salve
- Sixfingers Elixir
- Star of Cynosure
- Statue Skin Salve
- Storm Breath
- Stormbreaker Fulu
- Taper of Sanctification
- Thawing Candle
- Thousand-Year Dragonroot
- Tiger Menuki
- Topology Protoplasm
- Tracker's Stew
- Tricky Liniment
- Tteokguk of Time Advancement
- Valorous Coin
- Vapor Sphere
- Vengeful Demon's Tears
- Vermin Repellent Agent
- Wemmuth Trinket
- Wine of the Blood
- Witch's Finger
- Wounding Oil

## [7.8.2] - 2026-01-16

- Removed Effects Compendium Pack
    - Custom effects are generated at runtime now, this is in preparation for adding support for SF2e.
- Consumables are now under Items

### Added

- Ablative Armor Plating
- Alloy Orb
- Amphisbaena Spittle
- Antifungal Salve
- Apricot of Bestial Might
- Aromatic Ammunition
- Ascendant Dragon Spirit
- Auric Noodles
- Blight Breath
- Bloodhound Mask
- Bottled Omen
- Bloodthirsty Rune

## [7.8.1] - 2026-01-14

### Added

- Debilitating Strike/Double Debilitation
- Terrified Retreat

## [7.8.0] - 2026-01-13

PF2e System v7.8.0 Update
General Updates/Improvements as well

### Removed

- Dice So Nice Support
    - Caused enough issues trying to support so not going to bother with it anymore
- Befuddle
    - Appears to be broken and just removing it temporarily
- Chilling Spray
    - Appears to be broken and just removing it temporarily
- Aberrant Form
    - Don't like how this is handled

## [7.2.0] - 2025-06-25

PF2e System v7.2.1 Update

### Added

- Anticipate Peril
- Aqueous Blast
- Befuddle
- Benediction
- Chilling Spray
- Tailwind

### Fixed

- Infectious Enthusiasm
- Inside Ropes

## [7.0.1] - 2025-06-24

### Added

- Glass Shield
- Infectious Enthusiasm
- Inside Ropes
- Musical Accompaniment
- Protect Companion
- Ray of Frost
- Read Aura
- Read the Air
- Rousing Splash
- Take Root
- Tangle Vine

### Fixed

- Infinite Effects w/ Dice So Nice!

## [7.0.0] - 2025-06-17

Foundry Virtual Tabletop - Version 13 Support!
This is a release for PF2e v7.2.0

### Added

- Added a check to see what version of PF2e you are running and display a warning if you are using a different version.

### Changed

- Better support for Dice So Nice!
- Assassin Vine Wine -> Arbor Wine
- Choker-Arm Mutagen -> Bendy-Arm Mutagen

## [6.6.2] - 2025-06-03

This is a release for 6.12.4 of the PF2e System.

## [6.6.1] - 2025-05-23

This is a release for 6.12.2 of the PF2e System

### Changed

- Reworked out the data for effects are stored to reduce the final size

### Fixed

- Dropping prone with Kip Up will not longer have you stand up automatically
- The Sword Critical Specialization will now expire at the start of the turn instead of the end
- The automatic saving throw for Stunning Blows now has the incapacitation trait

## [6.6.0] - 2025-05-20

I don't remember all the changes that I made before I stopped working on this for a bit, most of it was reworking how the data is stored and using [FoundryVTT-Sync](https://github.com/MrVauxs/FoundryVTT-Sync). Also updated to support PF2e 6.12.1.

## [6.5.0] - 2025-02-03

### Added

- Support for PF2e Toolbelt's Target Helper
- Support for PF2e Toolbelt's Actionable
    - There is now a "Use Action" macro, in order to actually automate actions you will have to add this macro to the action using PF2e Toolbelt.
- Drop Prone
- Kip Up
- Stand

## [6.4.6] - 2025-01-29

### Added

- Painful Vibrations
- Whispers of the Void

### Changed

- Reworked how conditions are increased/decreased, all "unlocked" conditions of the specified type will be increased/decreased
- When adding a new condition it will add a new instance of the condition to the actor

### Fixed

- Disarm (Critical Failure)

## [6.4.5] - 2025-01-27

### Added

- Aura of Courage
- Vision of Death
- Frightened
- Freezing Rain

### Fixed

- Demoralize

## [6.4.4] - 2025-01-26

### Fixed

- Missing PF2e Assistant Effects

## [6.4.3] - 2025-01-26

### Added

- Bottled Lightning
- Eat Fire
- Figment
- Forbidding Ward
- Frostbite

### Changed

- Process Chat Messages on Render

## [6.4.2] - 2025-01-25

### Added

- Bullhorn
- Boost Eidolon
- Deep Sight
- Mystic Armor
- Heroism
- Wooden Fists
- Darkened Sight
- Wind Jump
- Weapon Surge
- Traveler's Transit
- Warp Step
- Vital Beacon

### Changed

- Effects are now added via a factory method to reduce code size

## [6.4.1] - 2025-01-23

### Added

- Accelerating Touch
- Agile Feet
- Angelic Halo
- Angelic Wings
- Ant Haul
- Athletic Rush
- Darkvision
- Lay on Hands
- Shield

### Changed

- Gather more roll options and remove duplicates

### Fixed

- Light

## [6.4.0] - 2025-01-22

### Added

- Reroll Support
    - When rerolling a check any effects/conditions/etc. that were created from the first result of the check will be removed

### Changed

- Refactor Assistant Classes/Data
- Reworked the list of automations so that it's now a tree view

### Fixed

- Critical Specializations

## [6.3.1] - 2025-01-19

### Fixed

- Grapple (Critical Failure)

## [6.3.0] - 2025-01-19

### Added

- Chat Message Prompts
    - Some automations require a choice from someone because their are multiple options, in these cases you will now see a whisper prompting you to make a decision.
- Aberrant Form
- Grapple (Critical Failure)

### Changed

- Refactor Utility Functions

## [6.2.0] - 2025-01-13

### Added

- Added settings that allow you to disable specific automations

### Changed

- Restructured data layout for better support of the new settings

### Fixed

- Fixed a minor problem that prevented a target from rolling their save automatically

## [6.1.6] - 2025-01-13

### Added

- Persistent Damage
- Persistent Healing

## [6.1.5] - 2025-01-13

### Added

- Daze
- Guidance
- Light
- Stabilize

### Changed

- Reworked how conditions are set

## [6.1.4] - 2025-01-12

### Fixed

- Grapple

## [6.1.3] - 2025-01-11

### Changed

- Minor internal changes to how messages are processed

### Removed

- Support for Dice So Nice! has been removed due to some issues with how it processes chat messages

## [6.1.2] - 2025-01-11

### Added

- Assassin Vine Wine
- Blood Booster
- Bomber's Eye Elixir
- Bravo's Brew
- Chromatic Jellyfish Oil
- Darkvision Elixir
- Egg Cream Fizz
- Fury Cocktail
- Gecko Potion
- Insight Coffee
- Merciful Balm
- Potency Crystal
- Potion of Emergency Escape
- Predator's Claw
- Sea Touch Elixir
- Shielding Salve
- Shining Ammunition
- Soothing Toddy
- Soothing Tonic
- Spiderfoot Brew
- Stone Body Mutagen
- Stone Fist Elixir
- Viperous Elixir

## [6.1.1] - 2025-01-11

### Added

- Bestial Mutagen
- Cheetah's Elixir
- Choker-Arm Mutagen
- Cognitive Mutagen
- Deadweight Mutagen
- Drakeheart Mutagen
- Eagle Eye Elixir
- Energy Mutagen
- Juggernaut Mutagen
- Numbing Tonic
- Prey Mutagen
- Quicksilver Mutagen
- Sanguine Mutagen
- Serene Mutagen
- Silvertongue Mutagen
- Skeptic's Elixir
- Theatrical Mutagen
- War Blood Mutagen

## [6.1.0] - 2025-01-10

### Added

- Tumble Behind
- Mistform Elixir
- Elixir of Life
- Antidote
- Antiplague

### Changed

- Improved Dice So Nice! support
- Moved all custom effects into a Compendium

## [6.0.4] - 2025-01-09

### Changed

- Added Demoralize Immunity

## [6.0.3] - 2025-01-08

### Added

- Basic support for Dice So Nice!
    - This is reliant on whoever is rolling to have 3D dice enabled, if they have it disabled than it will start processing their automations while it's still rolling on everyone else's screen.
- Bon Mot (Critical Success, Success, Critical Failure)
- Demoralize (Critical Success, Success)
- Stunning Blows (Failure, Critical Failure)

### Changed

- Disarm/Feint effect icons now match the system's icon for those actions.

## [6.0.2] - 2025-01-07

### Added

- Disarm (Success, Critical Failure)
- Feint (Critical Success, Success, Critical Failure)
    - Please note that for a successful feint the effect lasts until the end of your current turn, you will have to manually remove the effect after your next melee attack.

### Changed

- Made sure any updates or rolls are done from the primary user of an actor, if there are multiple users or no primary user than make sure it's done by the active GM.

## [6.0.1] - 2025-01-07

### Added

- Grapple (Critical Success, Success, Failure)
- Trip (Critical Success, Success, Failure)

## [6.0.0] - 2025-01-06

### Added

- Basic Critical Specialization Support for Bow, Brawling, Firearm, Flail, Hammer, Sling, Spear, and Sword
- Auto Self-Applied Effects (This is disabled if PF2e Toolbelt is doing this as well)
- Swashbuckler Panache

[Unreleased]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.9.1...HEAD
[7.9.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.9.0...v7.9.1
[7.9.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.8.3...v7.9.0
[7.8.3]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.8.2...v7.8.3
[7.8.2]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.8.1...v7.8.2
[7.8.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.8.0...v7.8.1
[7.8.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.2.0...v7.8.0
[7.2.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.0.1...v7.2.0
[7.0.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v7.0.0...v7.0.1
[7.0.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.6.2...v7.0.0
[6.6.2]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.6.1...v6.6.2
[6.6.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.6.0...v6.6.1
[6.6.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.5.0...v6.6.0
[6.5.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.6...v6.5.0
[6.4.6]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.5...v6.4.6
[6.4.5]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.4...v6.4.5
[6.4.4]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.3...v6.4.4
[6.4.3]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.2...v6.4.3
[6.4.2]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.1...v6.4.2
[6.4.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.4.0...v6.4.1
[6.4.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.3.1...v6.4.0
[6.3.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.3.0...v6.3.1
[6.3.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.2.0...v6.3.0
[6.2.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.6...v6.2.0
[6.1.6]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.5...v6.1.6
[6.1.5]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.4...v6.1.5
[6.1.4]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.3...v6.1.4
[6.1.3]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.2...v6.1.3
[6.1.2]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.1...v6.1.2
[6.1.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.1.0...v6.1.1
[6.1.0]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.0.4...v6.1.0
[6.0.4]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.0.3...v6.0.4
[6.0.3]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.0.2...v6.0.3
[6.0.2]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.0.1...v6.0.2
[6.0.1]: https://github.com/7H3LaughingMan/pf2e-assistant/compare/v6.0.0...v6.0.1
[6.0.0]: https://github.com/7H3LaughingMan/pf2e-assistant/releases/tag/v6.0.0
