# React Interview

## 使用說明

預設登入 Manager 1，可透過右上角點擊切換登入者。

## usage

```bash
npm i
npm run dev
```

## use skill
```
Frontend: React.js,  Next.js, Redux
UI Framework: MaterialUI
Backend: Express, Apollo Server
Language: TypeScript
```

## Authorization

主管 Manager: 查看底下員工的所有文件

員工 Staff: 建立文件，查看文件，編輯文件

網紅 Influencer: 查看與編輯有權限的文件

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
