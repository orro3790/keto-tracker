// eventually move the batch push functions here, so they can be triggered from command line with a node script, instead of having to trigger the function on render, and keeping the function in a react component

import { addCollectionAndDocuments } from './firebase/firebase.utils';
import { foodRegistryArray } from './parser.utils';

addCollectionAndDocuments('usda', foodRegistryArray);
