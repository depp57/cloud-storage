import { Injectable } from '@angular/core';
import { File, Folder } from './item';

export interface ItemVisitor {
    visitFile(file: File): boolean;
    visitFolder(file: Folder): boolean;
}

@Injectable()
export class CanContainVisitor implements ItemVisitor {
    visitFile(file: File): boolean {
        return false;
    }
    visitFolder(folder: Folder): boolean {
        return true;
    }
}

@Injectable()
export class HasFileExtension implements ItemVisitor {
    visitFile(file: File): boolean {
        return true;
    }
    visitFolder(file: Folder): boolean {
        return false;
    }

}
