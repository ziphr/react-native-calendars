// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'jasmine' or its corresponding ... Remove this comment to see the full error message
import Jasmine from 'jasmine';
import path from 'path';

const jasmine = new Jasmine();
jasmine.loadConfigFile(path.resolve(__dirname, 'support', 'jasmine.json'));
jasmine.execute();
