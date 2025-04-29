export interface Project {
    name:string;
    description:string;
    id:number;
    created_at:string;
    updated_at:string;
    is_owner:boolean;
}

export interface ProjectRequest {
    name:string;
    description:string;
}