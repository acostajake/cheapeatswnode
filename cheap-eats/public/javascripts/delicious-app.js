import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autoComplete from './modules/autoComplete';
import getLikes from './modules/like';
import makeMap from './modules/map';
import typeAhead from './modules/typeAhead';

const formLikes = $$('form.heart');
formLikes.on('submit', getLikes);

autoComplete($('#address'), $('#lat'), $('#long'));

makeMap( $('#map') );

typeAhead( $('.search') );

