export interface Asset {
    name: string;
    desc?: string;
    restype: string;
    createdat: number;
    updatedat: Date[];
    solicitor?: Solicitors;
    createdby: string;
    updatedby: string;
    tags?: string[];
    file: File;
    img: File;
    target: File;
}

interface Solicitors {
    name?: string;
    email: string;
    subject: string;
    role: string;
}

export const Roles = [
    { key: 'Maestro', value: 'Maestro'},
    { key: 'DI', value: 'Diseñador Instruccional'},
    { key: 'AP', value: 'Administrador de Proyecto'}
]