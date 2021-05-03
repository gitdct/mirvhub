import { userInfo } from "os"
import { by } from "protractor"

export interface Asset {
    name: string;
    description: string;
    createdat: number;
    createdby: string;
    solicitor?: Solicitor;
    tags?: string[];
    files: Files;
    target: boolean;
    assetbundle: boolean;
    imgext: string;
    tarext?: string;
}
interface Files {
    fbx?: FileProps[],
    glb?: FileProps[],
    obj?: FileProps[],
    andab?: FileProps[],
    iosab?: FileProps[]
}
interface FileProps {
    name?: string;
    type: string;
    size: number;
    uploadedBy?: string;
}
export interface Solicitor {
    name?: string;
    email: string;
    subject: Subject;
    role: string;
}
export interface Subject {
    key: string,
    name: string
}
