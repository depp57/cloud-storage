import { Injectable } from "@angular/core";
import { File, Folder } from "./item";

export interface ItemVisitator {
    visitFile(file: File): boolean;
    visitFolder(file: Folder): boolean;
}

@Injectable()
export class CanContainVisitator implements ItemVisitator {
    visitFile(file: File): boolean {
        return false;
    }
    visitFolder(folder: Folder): boolean {
        return true;
    }
}

@Injectable()
export class HasFileExtension implements ItemVisitator {
    visitFile(file: File): boolean {
        return true;
    }
    visitFolder(file: Folder): boolean {
        return false;
    }
    
}
