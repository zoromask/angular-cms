import { Component, Input, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import {
    PAGE_TYPE_METADATA_KEY,
    BLOCK_TYPE_METADATA_KEY,
    PROPERTY_METADATA_KEY,
    PROPERTIES_METADATA_KEY
} from '@angular-cms/core';

import { CMS, ContentService, Content, slugify } from '@angular-cms/core';

import { PAGE_TYPE, BLOCK_TYPE } from './../../constants';

@Component({
    templateUrl: './content-type-list.component.html',
})
export class ContentTypeListComponent implements OnDestroy {
    subParams: Subscription;

    type: string;
    contentName: string;
    contentTypes: Array<any> = [];
    parentId: string;

    constructor(private contentService: ContentService, private router: Router, private route: ActivatedRoute) { }

    ngOnInit() {
        this.subParams = this.route.params.subscribe(params => {
            this.parentId = params['id'] || undefined;
            this.type = params['type'];

            switch (this.type) {
                case PAGE_TYPE:
                    this.contentName = "New Page";
                    this.getAllPageTypes();
                    break;
                case BLOCK_TYPE:
                    this.contentName = "New Block";
                    this.getAllBlockTypes();
                    break;
            }
        })
    }

    createNewContent(contentType) {
        if (this.contentName) {
            let content: Content = {
                name: this.contentName,
                contentType: contentType.typeRef.name,
                parentId: this.parentId,
                nameInUrl: slugify(this.contentName)
            }

            switch (this.type) {
                case PAGE_TYPE:
                    this.savePage(content);
                    break;
                case BLOCK_TYPE:
                    this.saveBlock(content);
                    break;
            }
        }
    }

    private getAllPageTypes() {
        this.contentTypes = [];
        Object.keys(CMS.PAGE_TYPES).map(key => CMS.PAGE_TYPES[key]).forEach(pageType => {
            let pageTypeMetadata = Reflect.getMetadata(PAGE_TYPE_METADATA_KEY, pageType);

            this.contentTypes.push({
                typeRef: pageType,
                metadata: pageTypeMetadata,
            })
        });
    }

    private getAllBlockTypes() {
        this.contentTypes = [];
        Object.keys(CMS.BLOCK_TYPES).map(key => CMS.BLOCK_TYPES[key]).forEach(blockType => {
            let blockTypeMetadata = Reflect.getMetadata(BLOCK_TYPE_METADATA_KEY, blockType);

            this.contentTypes.push({
                typeRef: blockType,
                metadata: blockTypeMetadata,
            })
        });
    }

    private savePage(content: Content) {
        this.contentService.addContent(content).subscribe(
            res => {
                console.log(res);
                this.router.navigate(["/cms/editor/content/", PAGE_TYPE, res._id])
            },
            error => console.log(error)
        )
    }

    private saveBlock(content: Content) {
        this.contentService.addBlockContent(content).subscribe(
            res => {
                console.log(res);
                this.router.navigate(["/cms/editor/content/", BLOCK_TYPE, res._id])
            },
            error => console.log(error)
        )
    }

    ngOnDestroy() {
        this.subParams.unsubscribe();
    }
}