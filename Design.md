NEED TO TEST if i can delete current bot componented message and send a new one to immitate clicking 'next'
[YES above is possible]


Menus should be used on stuff that is not discord dependant but is server data dependant.
Discord does not allow passing string to the backend within the Menus, so raw strings should be passed in as part of the parameters

[partial implementation]
/role create `role:<@?number>` `type`
    Menus:
    - zone
    - condition
    - comparison
    - role group
    Buttons: 
    `cancel` `submit`

[done]
/role list

[done]
/role delete
    Menu:
    - role for rule to be deleted


[done]
/role-group create `name:string`

[done]
/role-group list

/role-group view
    Menu:
    - select group to be viewed in detail 

[done]
/role-group delete
    Menu:
    - select group to be deteted (should disconect rules from group in the process)

[done]
/role-group delete-all

/role-group add-role
    Menu:
    - select role to be added to a group (filter roles without group)
    - group to add role to

/role-group remove-role
    Menu: 
    - select role to be removed from a group (filter roles within a group)

/role-group order-roles
    Menu:
    - Order 1
    - Order 2
    - Order 3
    - Order 4
    - Order 5


/update-my-roles

[partial implementation]
/for-each-member-in-server update-roles

