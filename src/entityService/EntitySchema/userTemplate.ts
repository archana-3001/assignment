

export const userEntitySchema={
    "name": {
      "plural": "Users",
      "singular": "User"
    },
    "coreAttributes": [
        {
            "name": "Username",
            "description": "unique Username",
            "dataType": "string", 
            "indexed": true,
        },
        {
            "name": "email",
            "description": "unique email",
            "dataType": "string", 
            "indexed": true,
        }, 
        {
            "name": "PhoneNumber",
            "description": "unique Phone_number",
            "dataType": "string", 
            "indexed": true,
        },
        {
            "name": "Password",
            "description": "hashed password",
            "dataType": "string", 
            "indexed": false,
        },
        {
            "name": "FirstName",
            "description": "FirstName of user",
            "dataType": "string", 
            "indexed": true,
        },
        {
            "name": "LastName",
            "description": "LastName of user",
            "dataType": "string", 
            "indexed": true,
        }, 
        {
            "name": "IsActive",
            "description": "IsActive By default true",
            "dataType": "string", 
            "indexed": true
        },
        {
            "name": "IsAdmin",
            "description": "IsAdmin By default true",
            "dataType": "string", 
            "indexed": true,
        },
        {
            "name": "IsDeleted",
            "description": "If user deleted then it will be true else false",
            "dataType": "boolean",
            "defaultValue": false,
            "index": true

        }
    ],
    "isStateMachineEnabled": false
  }