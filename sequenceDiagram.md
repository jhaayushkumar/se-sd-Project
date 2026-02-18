# Sequence Diagram

## Main Flow: Create Task and Update Status (End-to-End)

```mermaid
sequenceDiagram
    actor Manager as Project Manager
    participant UI as Frontend UI
    participant Auth as Auth Middleware
    participant TC as Task Controller
    participant TS as Task Service
    participant TR as Task Repository
    participant PS as Project Service
    participant NS as Notification Service
    participant DB as Database
    participant WS as WebSocket Server
    actor Member as Team Member

    Note over Manager,Member: 1. Manager Creates Task
    
    Manager->>UI: Login with credentials
    UI->>Auth: POST /api/auth/login
    Auth->>DB: Validate credentials
    DB-->>Auth: User data
    Auth-->>UI: JWT token + user info
    UI-->>Manager: Dashboard displayed
    
    Manager->>UI: Navigate to project, click "Create Task"
    Manager->>UI: Fill task form (title, description, assignee, priority, due date)
    UI->>Auth: POST /api/tasks (with JWT)
    Auth->>Auth: Validate token & extract user
    Auth->>TC: Forward request with user context
    
    TC->>TC: Validate request body
    TC->>TS: createTask(taskDTO, managerId)
    
    TS->>PS: validateProjectAccess(projectId, managerId)
    PS->>DB: Check project membership
    DB-->>PS: Access granted
    PS-->>TS: Access confirmed
    
    TS->>TS: Apply business rules (validate dates, priority)
    TS->>TR: save(taskEntity)
    TR->>DB: INSERT INTO tasks
    DB-->>TR: Task saved with ID
    TR-->>TS: Task entity
    
    TS->>NS: createNotification(assigneeId, "New task assigned")
    NS->>DB: INSERT INTO notifications
    NS->>WS: Send real-time notification
    WS-->>Member: Push notification
    
    TS->>DB: INSERT INTO activity_log
    TS-->>TC: Task created successfully
    TC-->>UI: 201 Created + task data
    UI-->>Manager: Success message + task displayed
    
    Note over Manager,Member: 2. Team Member Updates Task Status
    
    Member->>UI: Receive notification, click to view task
    UI->>Auth: GET /api/tasks/{taskId} (with JWT)
    Auth->>Auth: Validate token
    Auth->>TC: Forward request
    TC->>TS: getTaskById(taskId, memberId)
    TS->>TR: findById(taskId)
    TR->>DB: SELECT * FROM tasks WHERE id = ?
    DB-->>TR: Task data
    TR-->>TS: Task entity
    TS->>TS: Check user access permission
    TS-->>TC: Task details
    TC-->>UI: 200 OK + task data
    UI-->>Member: Task details displayed
    
    Member->>UI: Click "Start Working" (change status to In Progress)
    UI->>Auth: PATCH /api/tasks/{taskId}/status (with JWT)
    Auth->>Auth: Validate token
    Auth->>TC: Forward request
    
    TC->>TC: Validate status transition
    TC->>TS: updateTaskStatus(taskId, newStatus, memberId)
    
    TS->>TR: findById(taskId)
    TR->>DB: SELECT * FROM tasks
    DB-->>TR: Current task
    TR-->>TS: Task entity
    
    TS->>TS: Validate state transition (Todo → In Progress)
    TS->>TS: Check user is assignee
    TS->>TR: update(taskEntity)
    TR->>DB: UPDATE tasks SET status = ?, updated_at = ?
    DB-->>TR: Update successful
    TR-->>TS: Updated task
    
    TS->>DB: INSERT INTO activity_log (action: "status_changed")
    
    TS->>NS: notifyProjectMembers(projectId, "Task status updated")
    NS->>DB: INSERT INTO notifications
    NS->>WS: Broadcast to project members
    WS-->>Manager: Real-time update
    
    TS-->>TC: Status updated successfully
    TC-->>UI: 200 OK + updated task
    UI-->>Member: Status updated, UI refreshed
    UI-->>Manager: Dashboard auto-refreshed with new status
    
    Note over Manager,Member: 3. Manager Adds Comment
    
    Manager->>UI: View task, add comment "Great progress!"
    UI->>Auth: POST /api/tasks/{taskId}/comments (with JWT)
    Auth->>TC: Forward to Comment Controller
    TC->>TS: addComment(taskId, commentDTO, managerId)
    TS->>TR: saveComment(commentEntity)
    TR->>DB: INSERT INTO comments
    DB-->>TR: Comment saved
    TR-->>TS: Comment entity
    
    TS->>NS: notifyTaskAssignee(memberId, "New comment")
    NS->>WS: Send notification
    WS-->>Member: Real-time comment notification
    
    TS-->>TC: Comment added
    TC-->>UI: 201 Created + comment data
    UI-->>Manager: Comment displayed
    UI-->>Member: Comment appears in real-time
```

## Flow Description

### Phase 1: Authentication & Task Creation
1. Manager logs in and receives JWT token
2. Manager navigates to project and creates new task
3. System validates manager's permissions
4. Task is saved to database
5. Notification sent to assigned team member
6. Activity logged for audit trail

### Phase 2: Task Status Update
1. Team member receives notification
2. Member views task details
3. Member updates task status (Todo → In Progress)
4. System validates status transition rules
5. Database updated with new status
6. Real-time notification sent to project manager
7. Activity logged

### Phase 3: Collaboration
1. Manager views updated task
2. Manager adds comment
3. Comment saved and notification sent
4. Team member receives real-time update

## Key Design Patterns Demonstrated

- **Layered Architecture**: Clear separation (Controller → Service → Repository)
- **Middleware Pattern**: Authentication/Authorization middleware
- **Repository Pattern**: Data access abstraction
- **Service Layer Pattern**: Business logic encapsulation
- **Observer Pattern**: Real-time notifications via WebSocket
- **Strategy Pattern**: Status transition validation
