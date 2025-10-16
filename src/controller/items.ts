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
export const addItem = (name: string, quantity: number, purchasedStatus: boolean): ShoppingItem => {
    const newItem: ShoppingItem = {
        id: currentId++,
        name,
        quantity,
        purchasedStatus
    }
    items.push(newItem);
    return newItem;
}

export const updateItem = (id: number, updates: Partial<Pick<ShoppingItem, 'name' | 'quantity' | 'purchasedStatus'>>): ShoppingItem | undefined => {
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        return undefined;
    }
    
    const item = items[itemIndex];
    if (!item) {
        return undefined;
    }
    
    // Update only the allowed fields
    if (updates.name !== undefined) {
        item.name = updates.name;
    }
    if (updates.quantity !== undefined) {
        item.quantity = updates.quantity;
    }
    if (updates.purchasedStatus !== undefined) {
        item.purchasedStatus = updates.purchasedStatus;
    }
    
    return item;
}