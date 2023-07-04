# Changelog

As of June 2023 all future changes in this project will be documented to this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   Support for Zone 54 Anabaseios [https://github.com/Rocket-Fish/fish-bot/issues/3]
-   Support for Characters on the 4th NA DC dynamis
-   Added two properties to Groups: Order, and Publicity
-   Added command `/group edit` to edit the publicity and order of groups
-   Added command `/gimme-roles`

### Changed

-   Less confusing UX: `greaterThan3` and `greaterThan4` are now `greaterThanOrEqualTo3` and `greaterThanOrEqualTo4` should fix [https://github.com/Rocket-Fish/fish-bot/issues/2]
-   `convertRoleListToSelectOptions` now has a description limit of 100 characters
-   Command `/for-each-member-in-server update-roles` operates off of groups now
-   Command `/group create name: string expressConfiguration: boolean` can optionally used to specify group's publicity and order when a group is created
-   FFlogs roles in unordered groups will no longer remove roles that a person is not qualified for, only in ordered groups will a unqualifying fflogs role be removed

### Fixed

-   Issue with `ordered` groups not setting the correct roles if a user already has a given role
-   Issue with `ordered` groups not removing roles that a user is no longer qualified for, or has met requirements for a higher priority role
