import sketch from "sketch";
import utils from './utils';
var utils_obj = new utils();

/**
 *File systems class implementing file/dir operations like save, renaming, creating directories etc.
 *
 * @class fileSystem
 */
class fileSystem 
{

    constructor(context) 
    {
        this.context = context;
    }

    /**
     * Method to save text to a file.
     *
     * @param {*} filename
     * @param {*} text
     * @memberof fileSystem
     */
    saveTextToFile(filename, text) 
    {
        /* NSString.stringWithFormat and writeToFile_atomically_encoding_error 
        * is not part of official sketch javascript api 
        */
        const string = NSString.stringWithFormat("%@", text);
        string.writeToFile_atomically_encoding_error(filename, true, NSUTF8StringEncoding, nil);
    }

    /**
     * Returns file path for the sketch context.
     *
     * @returns path for sketch file
     * @memberof fileSystem
     */
    getCurrentFilePath() 
    {
        return this.context.document.fileURL().path().replace(/\.sketch$/, '')
    }

    /**
     * Deletes the file given the path.
     *
     * @param {*} path
     * @memberof fileSystem
     */
    deleteFile(path) 
    {
        /* NSFileManager.defaultManager and fileManager.removeItemAtPath_error
        * is not part of official sketch javascript api 
        */
        var fileManager = NSFileManager.defaultManager();
        fileManager.removeItemAtPath_error(path, nil);
    }

    /**
     * Creates a folder given its name as argument.
     *
     * @param {*} name
     * @memberof fileSystem
     */
    createFolder(name) 
    {
        /* NSFileManager.defaultManager and fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_
        * is not part of official sketch javascript api 
        */
        var fileManager = NSFileManager.defaultManager();
        fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_(name, true, nil, nil);
    }

    /**
     * Rename the file given the source and destination.
     *
     * @param {*} srcName
     * @param {*} dstName
     * @memberof fileSystem
     */
    renameFile(srcName, dstName) 
    {
        /* NSFileManager.defaultManager and fileManager.createDirectoryAtPath_withIntermediateDirectories_attributes_error_
        * is not part of official sketch javascript api 
        */
        var fileManager = NSFileManager.defaultManager();
        const exists = NSFileManager.defaultManager().fileExistsAtPath(srcName);
        if(exists)
        {
            fileManager.moveItemAtPath_toPath_error( srcName, dstName, nil);
        }
        else
        {
            errorMessage = "FileNotFoundError: Error in renaming file: " + srcName
            utils_obj.alertError(errorMessage)
        }
    }

}

export default fileSystem;