import {Quicknote} from "../shared/models/quicknote";
export interface QuicknoteData {

	quicknoteKeys: string[];
	quicknotes: Quicknote[];

}

export const INITIAL_QUICKNOTE_DATA = {

	quicknoteKeys: [],
	quicknotes: []

};
