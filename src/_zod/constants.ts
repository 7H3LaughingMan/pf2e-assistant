import * as R from "remeda";
import * as z from "zod";

export const zActiveEffectChangeType = z.literal(R.values(CONST.ACTIVE_EFFECT_CHANGE_TYPES));

export const zCanvasPerformanceMode = z.literal(R.values(CONST.CANVAS_PERFORMANCE_MODES));

export const zChatMessageStyle = z.literal(R.values(CONST.CHAT_MESSAGE_STYLES));

export const zCompatibilityMode = z.literal(R.values(CONST.COMPATIBILITY_MODES));

export const zLightingLevel = z.literal(R.values(CONST.LIGHTING_LEVELS));

export const zPrimaryDocumentType = z.literal(R.values(CONST.PRIMARY_DOCUMENT_TYPES));

export const zEmbeddedDocumentType = z.literal(R.values(CONST.EMBEDDED_DOCUMENT_TYPES));

export const zDocumentType = z.literal(R.values(CONST.ALL_DOCUMENT_TYPES));

export const zWorldDocumentType = z.literal(R.values(CONST.WORLD_DOCUMENT_TYPES));

export const zCompendiumDocumentType = z.literal(R.values(CONST.COMPENDIUM_DOCUMENT_TYPES));

export const zDocumentOwnershipString = z.literal(R.keys(CONST.DOCUMENT_OWNERSHIP_LEVELS));

export const zDocumentOwnershipLevel = z.literal(R.values(CONST.DOCUMENT_OWNERSHIP_LEVELS));

export const zDrawingFillType = z.literal(R.values(CONST.DRAWING_FILL_TYPES));

export const zFolderDocumentType = z.literal(R.values(CONST.FOLDER_DOCUMENT_TYPES));

export const zMovementDirection = z.literal(R.values(CONST.MOVEMENT_DIRECTIONS));

export const zGridType = z.literal(R.values(CONST.GRID_TYPES));

export const zGridDiagonalRule = z.literal(R.values(CONST.GRID_DIAGONALS));

export const zGridSnappingMode = z.literal(R.values(CONST.GRID_SNAPPING_MODES));

export const zMacroScope = z.literal(R.values(CONST.MACRO_SCOPES));

export const zMacroType = z.literal(R.values(CONST.MACRO_TYPES));

export const zPlaylistMode = z.literal(R.values(CONST.PLAYLIST_MODES));

export const zPlaylistSortMode = z.literal(R.values(CONST.PLAYLIST_SORT_MODES));

export const zDirectorySearchMode = z.literal(R.values(CONST.DIRECTORY_SEARCH_MODES));

export const zPackageType = z.literal(R.values(CONST.PACKAGE_TYPES));

export const zPackageAvailabilityCode = z.literal(R.values(CONST.PACKAGE_AVAILABILITY_CODES));

export const zSoftwareUpdateChannel = z.literal(R.keys(CONST.SOFTWARE_UPDATE_CHANNELS));

export const zTableResultType = z.literal(R.values(CONST.TABLE_RESULT_TYPES));

export const zJournalEntryPageFormat = z.literal(R.values(CONST.JOURNAL_ENTRY_PAGE_FORMATS));

export const zTextAnchorPoint = z.literal(R.values(CONST.TEXT_ANCHOR_POINTS));

export const zTileOcclusionMode = z.literal(R.values(CONST.TILE_OCCLUSION_MODES));

export const zTokenDisplayMode = z.literal(R.values(CONST.TOKEN_DISPLAY_MODES));

export const zTokenDisposition = z.literal(R.values(CONST.TOKEN_DISPOSITIONS));

export const zTokenShapeType = z.literal(R.values(CONST.TOKEN_SHAPES));

export const zUserRoleName = z.literal(R.keys(CONST.USER_ROLES));

export const zUserRole = z.literal(R.keys(CONST.USER_ROLE_NAMES));

export const zUserPermission = z.literal(R.keys(CONST.USER_PERMISSIONS));

export const zEdgeDirection = z.literal(R.values(CONST.EDGE_DIRECTIONS));

export const zWallDoorType = z.literal(R.values(CONST.WALL_DOOR_TYPES));

export const zWallDoorState = z.literal(R.values(CONST.WALL_DOOR_STATES));

export const zWallDoorInteraction = z.literal(R.values(CONST.WALL_DOOR_INTERACTIONS));

export const zWallRestrictionType = z.literal(R.values(CONST.WALL_RESTRICTION_TYPES));

export const zEdgeSenseType = z.literal(R.values(CONST.EDGE_SENSE_TYPES));

export const zWallMovementType = z.literal(R.values(CONST.WALL_MOVEMENT_TYPES));

export const zImageFileExtension = z.literal(R.keys(CONST.IMAGE_FILE_EXTENSIONS));

export const zVideoFileExtension = z.literal(R.keys(CONST.VIDEO_FILE_EXTENSIONS));

export const zAudioFileExtension = z.literal(R.keys(CONST.AUDIO_FILE_EXTENSIONS));

export const zFileExtension = z.literal(R.keys(CONST.UPLOADABLE_FILE_EXTENSIONS));

export const zFileCategory = z.literal(R.keys(CONST.FILE_CATEGORIES));

export const zRegionMovementSegmentType = z.literal(R.values(CONST.REGION_MOVEMENT_SEGMENTS));

export const zDrawingShapeType = z.literal(["r", "e", "t", "p", "f"]);

export const zShapeDataType = z.literal(["rectangle", "circle", "ellipse", "polygon"]);

export const zUserAction = z.literal(["create", "update", "delete"]);

export const zHexColorstring = z.templateLiteral(["#", z.string()]).refine((value) => /^#[0-9A-Fa-f]{6}$/.test(value));

export const zAudioFilePath = z.templateLiteral([z.string(), ".", zAudioFileExtension]);

export const zImageFilePath = z.templateLiteral([z.string(), ".", zImageFileExtension]);

export const zVideoFilePath = z.templateLiteral([z.string(), ".", zVideoFileExtension]);

export const zFilePath = z.union([zAudioFilePath, zImageFilePath, zVideoFilePath]);
