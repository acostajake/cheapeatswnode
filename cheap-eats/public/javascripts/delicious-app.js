import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autoComplete';
import makeMap from './modules/map';
import typeAhead from './modules/typeAhead';

autoComplete($('#address'), $('#lat'), $('#long'));

makeMap( $('#map') );

typeAhead( $('.search') );