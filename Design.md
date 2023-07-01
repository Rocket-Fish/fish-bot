# High Level Design

## General Design COnsiderations

Menus should be used on stuff that is not discord dependant but is server data dependant.

Discord does not allow passing string to the backend within the Menus, so raw strings should be passed in as part of the parameters

Terminology:

Public vs Private groups, rules in public groups will be accessible and can be applied by all server members when they run commands like `update-my-roles`, rules private groups and ungrouped rules can only be applied by server admins

Ordered vs Unordered groups, Ordered groups are a groups where the ordering of role rules in the group actually matters because only ONE of the rules will be applied. Unordered groups are groups where the ordering of the role rules don't matter because every rule in this group will be checked again, and possibly be given all the roles

## Admin Commands

### ☑️ /role create `role: <@?number>` `condition: [noone|everyone|fflogs]`

-   [x] condition: noone
-   [x] condition: everyone
-   [x] condition: fflogs

    -   [x] Dropdown Select: Zone
    -   [x] Dropdown Select: Operand
    -   [x] Dropdown Select: Condition

-   [ ] Future TODO: support more complex role rules

### ☑️ /role list

-   [x] list all role rules
-   [x] show which role rules are in a group

### ☑️ /role delete

-   [x] Dropdown Select: role rule to be deleted

### /group create `name: string` `expressConfiguration: boolean`

-   [ ] Add express configuration field and add support to following
-   if(expressConfiguration) default to private unordered group
-   if(expressConfiguration)
    -   [ ] Dropdown Select: Private|Public
    -   [ ] Dropdown Select: Ordered|Unordered

### /group edit-config

-   [ ] Dropdown Select: Which group
-   [ ] After above selection show another dropdown select with following
    -   [ ] Dropdown Select: Private|Public
    -   [ ] Dropdown Select: Ordered|Unordered

### /group list

-   [x] list groups
-   [ ] show the contents of said groups

### ☑️ /group delete

-   [x] Dropdown Select: group to be deleted (should disconnect role rules from group in the process)

### ☑️ /group delete-all

### ☑️ /group add-role

-   [x] Dropdown Select: role rule to be added to a group (filter rules without group)
-   [x] Dropdown Select: group to add role to

### ☑️ /group remove-role

-   [x] Dropdown Select: role rule to be removed from a group (filter rules inside a group)

### /group order-roles

-   TODO: think about how to design a group of dropdown menus to order roles
-   Maybe: Menu: - Order 1 - Order 2 - Order 3 - Order 4 - Order 5

### /for-each-member-in-server update-roles

-   [x] Update roles based on every rule and group
-   [ ] Filter specific rules or groups to update like for example, every single rule/group, only apply all public groups, only apply specific group

### /dry-run for-each-member-in-server update-roles

-   [ ] same functionality as `/for-each-member-in-server update-roles` but dumps changes out to chat instead actually performing changes

### /dry-run server-member update-roles `user: <@number>`

-   [ ] same functionality as `/dry-run for-each-member-in-server update-roles` but only applies it to one person, mainly for debugging specific people

## Server Member Commands

### /update-all-my-roles

-   [ ] TODO: update a user's roles based on all public groups

### /update-a-group-of-roles

-   [ ] Dropdown Select: which role group to apply
