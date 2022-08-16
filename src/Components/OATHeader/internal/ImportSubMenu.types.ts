export type ImportSubMenuProps = {
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
    subMenuActive?: boolean;
    targetId?: string;
    uploadFile?: () => void;
    uploadFolder?: () => void;
};
