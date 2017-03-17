import * as vscode from 'vscode';
const globby = require('globby');
const path = require('path');
const fs = require('fs');
const Jimp = require('jimp');

function pathJoin(str) {
    return path.join(vscode.workspace.rootPath, str);
}

function renderTpl(data) {
    return `width: ${data.width}px;
    height: ${data.height}px;
    background-image:url(${data.src});`
}

/**
 *  cssImg 快速插入css 图片
 * 
 * @export
 */
export function cssImg() {
    let tmpString: string = '';
    globby([pathJoin('/src/**/*.{png,jpg}'), pathJoin('/assets/**/*.{png,jpg}'), pathJoin('/public/**/*.{png,jpg}') , pathJoin('/images/**/*.{png,jpg}')]).then((paths) => {
        console.log(paths);
        let tmp = [];
        paths.forEach((v) => {
            tmp.push({
                "label": path.parse(v).base,
                "description": path.relative(vscode.workspace.rootPath, v),
                "src":v
            });
        });
        vscode.window.showQuickPick(tmp).then(function (action) {
            console.log(action);
            if (!action) {
                // vscode.window.showErrorMessage('出错了1，请重试');
                return;
            }
            
            Jimp.read(action.src).then(function (image) {
                var edit = vscode.window.activeTextEditor;
                var imgRelativePath = path.relative(path.parse(edit.document.uri.path).dir.substring(1), action.src);
                imgRelativePath = imgRelativePath.replace(/\\/g,'/');
                if (/^\\/.test(imgRelativePath)) {
                    imgRelativePath = '.' + imgRelativePath;
                } else if (/^[a-zA-Z0-9]/.test(imgRelativePath)){
                    imgRelativePath = './'  + imgRelativePath;
                }
                let imgData = {
                    width: image.bitmap.width,
                    height: image.bitmap.height,
                    src: imgRelativePath
                }
                
                edit.edit((editBuilder) => {
                    var position = new vscode.Position(edit.selection.active.line, edit.selection.active.character);
                    editBuilder.insert(position, renderTpl(imgData));
                });
            }).catch(function (err) {
                console.log(err);
                vscode.window.showErrorMessage('出错了，请重试');
                // handle an exception
            });

        })
        // fs.writeFileSync(pathJoin('/sass/_base64.scss'),tmpString);
    })
}

