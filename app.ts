import { v4 as uuidv4 } from 'uuid';
import * as fs from "fs";

enum Priority {
    None,
    Low,
    Medium,
    High
}

class Priorities {
    private static lookup: {[key in Priority]?: string} = {
        [Priority.None]: "None",
        [Priority.Low]: "Low",
        [Priority.Medium]: "Medium",
        [Priority.High]: "High"
    }

    public static toString(priority: Priority): string {
        return Priorities.lookup[priority] || ""
    }
}

class TodoItem {
    id: string = ""
    content: string = ""
    priority: Priority = Priority.None
    dueDate: Date | null = null
    done: boolean = false

    constructor(data: string | {id: string, content: string, priority: number, due_date: Date | null, done: boolean}) {
        if(typeof data === 'string') {
            this.id = uuidv4()
            this.content = data
        } else {
            this.id = data.id
            this.content = data.content
            this.priority = data.priority
            this.dueDate = data.due_date
            this.done = data.done
        }
    }

    withPriority(priority: Priority): TodoItem {
        this.priority = priority
        return this
    }

    withDueDate(dueDate: Date | null): TodoItem {
        this.dueDate = dueDate
        return this
    }

    toString(): string {
        let out = `[${this.done ? 'x': ' '}] ${this.content}`
        if(this.priority != Priority.None) {
            out = out + ` [${Priorities.toString(this.priority)}]`
        }
        if(this.dueDate != null) {
            out = out + ` (${this.dueDate})`
        }
        return out
    }
}


class TodoList {
    items: Map<string, TodoItem> = new Map();

    toString(): string {
        const arr: Array<string> = []
        this.items.forEach(item => {
            arr.push(item.toString())
        })
        return arr.join("\n")
    }

    static fromJson(jsonData: string): TodoList | null {
        const obj = JSON.parse(jsonData)

        if(Array.isArray(obj)) {
            const list = new TodoList()
            for(const data of obj) {
                const item = new TodoItem(data)
                list.items.set(item.id, item)
            }
            return list
        }
        return null
    }

    toJson(): string {
        // 가장 간단한 방법, 다만 Array를 거쳐가기 때문에 메모리 사용량이 매우 많아진다.
        return JSON.stringify(Array.from(this.items.values()))
    }
}


try {
    let started: number, ended: number

    const data = fs.readFileSync("todo.json", "utf-8")

    started = performance.now()
    const items = TodoList.fromJson(data)
    ended = performance.now()
    const elapsedFrom = (ended - started) * 0.001

    if(items !== null) {
        console.log(items.toString())

        started = performance.now()
        const newJson= items.toJson()
        ended = performance.now()
        const elapsedTo = (ended - started) * 0.001

        console.log(`fromJson - ${elapsedFrom} seconds, toJson - ${elapsedTo} seconds`)
    }
} catch(e) {
    console.error("an error occurred: ", e)
}

