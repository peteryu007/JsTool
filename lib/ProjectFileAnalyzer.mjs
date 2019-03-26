
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;
/**
 * 分析cs的csproj文件（xml格式）
*/
exports.ProjectFileAnalyzer =  class 
{
    /**
     * 
     * @param {DOMParser} xmlDoc 
     */

    constructor(xmlDoc) {
        this._xmlDoc = xmlDoc; 
        this._selectRoot 
                = xpath.useNamespaces({"u":"http://schemas.microsoft.com/developer/msbuild/2003"});
        
    }
    /**
     * 获得引用dll的文件名
     * @param {string} nodeType 节点名
     */
    GetDllFiles(nodeType = "HintPath"){
        let referenceNodes = this._selectRoot(`//u:${nodeType}`,this._xmlDoc);
        
        let resultList =  
            referenceNodes.map(node=>node.firstChild.data);      
        
        return resultList;
    }
    /**
     * 获得cs的文件名
     * @param {string} nodeType 节点名
     */
    GetCSFiles(nodeType = "Compile"){   

        let referenceNodes =  this._selectRoot(`//u:${nodeType}`,this._xmlDoc);

        let resultList = referenceNodes
            .filter(node=>node.childNodes.length==0)
            .map(node=>node.getAttribute("Include"));  

        return resultList;
    }

      /**
     * 获得编译成dll的名字
     * @param {string} nodeType 节点名
     */
    GetAssemblyName(nodeType = "AssemblyName")
    {
        let referenceNode = this._selectRoot(`//u:${nodeType}`,this._xmlDoc);    
        return referenceNode[0].firstChild.data;
    }
}