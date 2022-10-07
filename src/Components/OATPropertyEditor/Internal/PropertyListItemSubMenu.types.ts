export type PropertyListItemSubMenuProps = {
    index?: number;
    subMenuActive?: boolean;
    deleteItem?: (index: number) => void;
    deleteNestedItem?: (parentIndex: number, index: number) => void;
    parentIndex?: number;
    onDuplicate?: () => void;
    onPropertyListAddition?: () => void;
    onTemplateAddition?: () => void;
    onMoveUp?: (index: number, moveUp: boolean) => void;
    onMoveDown?: (index: number, moveUp: boolean) => void;
    removeItem?: boolean;
    duplicateItem?: boolean;
    addItemToPropertyList?: boolean;
    addItemToTemplates?: boolean;
    targetId?: string;
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
};
