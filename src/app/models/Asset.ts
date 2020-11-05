export interface Asset {
    name: string;
    desc?: string;
    restype: string;
    createdat: Date;
    updatedat: Date[];
    solicitor?: Solicitors;
    createdby: string;
    updatedby: string;
    tags?: string[];
    file: File;
    target: File;
}

interface Solicitors {
    name?: string;
    email: string;
    subject: string;
    role: Role;
}

export enum Role {
    Maestro = 'Maestro',
    DI = 'DI',
    AP = 'AP'
}