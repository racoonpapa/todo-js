const uuidv4 = require('uuid').v4;
const fs = require("fs");

const Priority = Object.freeze({
    None: 0,
    Low: 1,
    Medium: 2,
    High: 3
})

class TodoItem {
    static priorityMap = { [Priority.None]: "None", [Priority.Low]: "Low", [Priority.Medium]: "Medium", [Priority.High]: "High" }

    getPriorityText() {
        return TodoItem.priorityMap[this.priority]
    }

    constructor(data) {
        if(typeof data === 'string') {
            this.id = uuidv4()
            this.content = data
        } else if(typeof data === 'object' && data !== null && !Array.isArray(data)){
            Object.assign(this, data)
        } else throw new Error("cannot initialize TodoItem")
    }

    withPriority(priority) {
        this.priority = priority
        return this
    }

    withDueDate(dueDate) {
        this.dueDate = dueDate
        return this
    }

    toString() {
        let out = `[${this.done ? 'x': ' '}] ${this.content}`
        if(this.priority !== Priority.None) {
            out = out + ` [${this.getPriorityText(this.priority)}]`
        }
        if(this.dueDate != null) {
            out = out + ` (${this.dueDate})`
        }
        return out
    }
}


class TodoList {
    items = new Map()

    print() {
        if(this.items != null) this.items.forEach(item => console.log(item.toString()))
    }

    static fromJson(jsonData) {
        if(jsonData) {
            const obj = JSON.parse(jsonData)
            if (Array.isArray(obj)) {
                const list = new TodoList()
                for (const data of obj) {
                    const item = new TodoItem(data)
                    list.items.set(item.id, item)
                }
                return list
            }
        }
        return null
    }

    toJson() {
        return JSON.stringify(Array.from(this.items.values()))
    }
}


try {
    let started, ended

    const data = fs.readFileSync("todo.json", "utf-8")

    started = performance.now()
    const items = TodoList.fromJson(data)
    ended = performance.now()
    const elapsedFrom = (ended - started) * 0.001

    if(items !== null) {
        // items.print()

        started = performance.now()
        const newJson= items.toJson()
        ended = performance.now()
        const elapsedTo = (ended - started) * 0.001

        // console.log(newJson)

        console.log(`fromJson - ${elapsedFrom} seconds, toJson - ${elapsedTo} seconds`)
    }
} catch(e) {
    console.error("an error occurred: ", e)
}

