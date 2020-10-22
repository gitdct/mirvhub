export interface Asset {
    name: string;
    desc?: string;
    restype: ResourceType;
    createdat: Date;
    updatedat: Date[];
    solicitor?: Solicitors;
    createdby: string;
    updatedby: string;
    tags?: string[];
}

interface Solicitors {
    name: string;
    email: string;
    subject: string[];
    role: Role;
}

export enum ResourceType {
    '' = '',
    AssetBundle = 'AssetBundle',
    Fbx = 'fbx',
    Material = 'material',
    Blend = 'blend',
    Maya = 'maya',
    Glb = 'glb'
}

enum Role {
    Maestro = 'Maestro',
    DI = 'DI',
    AP = 'AP'
}