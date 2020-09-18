/********************************************************************************
 * Copyright (C) 2020 Ericsson and others.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * This Source Code may also be made available under the following Secondary
 * Licenses when the conditions for such availability set forth in the Eclipse
 * Public License v. 2.0 are satisfied: GNU General Public License, version 2
 * with the GNU Classpath Exception which is available at
 * https://www.gnu.org/software/classpath/license.html.
 *
 * SPDX-License-Identifier: EPL-2.0 OR GPL-2.0 WITH Classpath-exception-2.0
 ********************************************************************************/

import { injectable, inject, interfaces } from 'inversify';
import { FrontendApplicationContribution, LabelProvider } from '@theia/core/lib/browser';
import { FileService } from '@theia/filesystem/lib/browser/file-service';
import { WorkspaceService } from '@theia/workspace/lib/browser';

export function bindSampleFileWatching(bind: interfaces.Bind): void {
    bind(FrontendApplicationContribution).to(SampleFileWatchingContribution).inSingletonScope();
}

@injectable()
export class SampleFileWatchingContribution implements FrontendApplicationContribution {

    @inject(FileService)
    protected readonly files: FileService;

    @inject(LabelProvider)
    protected readonly label: LabelProvider;

    @inject(WorkspaceService)
    protected readonly workspace: WorkspaceService;

    onStart(): void {
        this.files.onDidFilesChange(event => {
            // Get the workspace roots for the current frontend:
            const roots = this.workspace.tryGetRoots();
            // Create some name to help find out which frontend logged the message:
            const workspace = roots.length > 0
                ? roots.map(root => this.label.getName(root.resource)).join('+')
                : '<no workspace>';
            console.log(`Sample File Watching: ${event.changes.length} file(s) changed! ${workspace}`);
        });
    }

}
