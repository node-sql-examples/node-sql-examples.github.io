
export interface Entry {
    category: string
    query: string
    [dialect:string]: string;
}

export interface Category {
    name: string
    shown: boolean;
    entries: Entry[]
}

export interface State {
    categories: {
        [name: string]: Category;
    }
    filter: Filter;
}

export interface Filter {
    text: string
    dialect: string
}
