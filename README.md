# React Interview

## 使用說明

預設登入 Manager 1，可透過右上角點擊切換登入者。

## usage
```
Frontend: React.js,  Next.js
UI Framework: MaterialUI
Backend: Express, Apollo Server
Lauguage: TypeScript
```
## schema

```gql
  type User {
    id: ID!
    workId: String!
    password: String!
    name: String!
    manager: ID
    position: String!
  }

  type Task {
    id: ID!
    title: String!
    createdBy: User!
    viewers: [ID]!
    editors: [ID]!
    status: String!
    content: String!
  }
```

## json data storage
users: /apollo/data/users

tasks: /apollo/data/tasks