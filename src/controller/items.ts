import { ShoppingItem } from '../models/items';
let items: ShoppingItem[] = [];
let currentId = 0;
export const getItems = (): ShoppingItem[] => {
    return items;
}
export const getItemById = (id: number): ShoppingItem | undefined => {
    const item = items.find(item => item.id === id);
    return item;
}
export const addItem = (name: string, quantity: number, category: string): ShoppingItem => {
    const newItem: ShoppingItem = {
        id: currentId++,
        name,
        quantity,
        category
    }
    items.push(newItem);
    return newItem;
}