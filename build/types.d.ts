declare module "@foundryvtt/foundryvtt-cli" {
    type DocumentType =
        | "Actor"
        | "Adventure"
        | "Cards"
        | "ChatMessage"
        | "Combat"
        | "FogExploration"
        | "Folder"
        | "Item"
        | "JournalEntry"
        | "Macro"
        | "Playlist"
        | "RollTable"
        | "Scene"
        | "Setting"
        | "User";

    type DocumentCollection =
        | "actors"
        | "adventures"
        | "cards"
        | "messages"
        | "combats"
        | "fog"
        | "folders"
        | "items"
        | "journal"
        | "macros"
        | "playlists"
        | "tables"
        | "scenes"
        | "settings"
        | "users";

    type PackageOptions = {
        nedb?: boolean;
        yaml?: boolean;
        log?: boolean;
        transformEntry?: EntryTransformer;
    };

    type CompileOptions = PackageOptions & {
        recursive?: boolean;
    };

    type ExtractOptions = PackageOptions & {
        yamlOptions?: object;
        jsonOptions?: JSONOptions;
        documentType?: DocumentType;
        clean?: boolean;
        collection?: DocumentCollection;
        transformName?: NameTransformer;
    };

    type JSONOptions = {
        replacer?: JSONReplacer | Array<string | number>;
        space?: string | number;
    };

    type JSONReplacer = (key: string, value: any) => any;

    type EntryTransformer = (entry: object) => Promise<false | void>;

    type NameTransformer = (entry: object) => Promise<string | void>;

    function compilePack(src: string, dest: string, options?: CompileOptions): Promise<void>;

    function extractPack(src: string, dest: string, options?: ExtractOptions): Promise<void>;
}
