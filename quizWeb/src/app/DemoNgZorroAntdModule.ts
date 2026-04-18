import { NgModule } from '@angular/core';

import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzLayoutModule } from 'ng-zorro-antd/layout';

@NgModule({
  exports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzLayoutModule
  ]
})
export class DemoNgZorroAntdModule {}