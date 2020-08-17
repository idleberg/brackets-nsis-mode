(function () {
    'use strict';

    /*! brackets-nsis-mode | MIT License | https://github.com/idleberg/brackets-nsis-mode */

    define(function (require, exports, module) {

        // Declare variables
        var CodeMirror          = brackets.getModule("thirdparty/CodeMirror/lib/codemirror"),
            LanguageManager     = brackets.getModule("language/LanguageManager");

        // codemirror-nsis (https://github.com/idleberg/codemirror-nsis)
        CodeMirror.defineSimpleMode("nsis",{
          start:[
            // Numbers
            {regex: /(?:[+-]?)(?:0x[\d,a-f]+)|(?:0o[0-7]+)|(?:0b[0,1]+)|(?:\d+.?\d*)/, token: "number"},

            // Strings
            { regex: /"(?:[^\\"]|\\.)*"?/, token: "string" },
            { regex: /'(?:[^\\']|\\.)*'?/, token: "string" },
            { regex: /`(?:[^\\`]|\\.)*`?/, token: "string" },

            // Compile Time Commands
            {regex: /^\s*!(?:a(?:dd(?:includedir|plugindir)|ppendfile)|cd|de(?:fine|lfile)|e(?:cho|rror|xecute)|finalize|get(?:dllversion|tlbversion)|in(?:clude|sertmacro)|makensis|p(?:ackhdr|ragma)|s(?:earch(?:parse|replace)|ystem)|tempfile|undef|verbose|warning)\b/, token: "keyword"},

            // Conditional Compilation
            {regex: /^\s*(?:\!(if(?:n?def)?|ifmacron?def|macro))\b/, token: "keyword", indent: true},
            {regex: /^\s*(?:\!(else|endif|macroend))\b/, token: "keyword", dedent: true},

            // Runtime Commands
            {regex: /^\s*(?:A(?:bort|dd(?:BrandingImage|Size)|llow(?:RootDirInstall|SkipFiles)|utoCloseWindow)|B(?:G(?:Font|Gradient)|r(?:andingText|ingToFront))|C(?:RCCheck|a(?:ll(?:InstDLL)?|ption)|h(?:angeUI|eckBitmap)|learErrors|o(?:mp(?:letedText|onentText)|pyFiles)|reate(?:Directory|Font|ShortCut))|D(?:e(?:lete(?:(?:INIS(?:ec|tr)|Reg(?:Key|Value)))?|tail(?:Print|sButtonText))|ir(?:Text|V(?:ar|erify)))|E(?:n(?:ableWindow|umReg(?:Key|Value))|x(?:ch|ec(?:(?:Shell(?:Wait)?|Wait))?|pandEnvStrings))|F(?:i(?:le(?:(?:BufSize|Close|ErrorText|Open|Read(?:(?:Byte|UTF16LE|Word))?|Seek|Write(?:(?:Byte|UTF16LE|Word))?))?|nd(?:Close|First|Next|Window))|lushINI)|G(?:et(?:Cur(?:InstType|rentAddress)|D(?:LLVersion(?:Local)?|lgItem)|ErrorLevel|F(?:ileTime(?:Local)?|u(?:llPathName|nctionAddress))|InstDirError|KnownFolderPath|LabelAddress|TempFileName)|oto)|HideWindow|I(?:con|f(?:Abort|Errors|FileExists|R(?:ebootFlag|tlLanguage)|S(?:hellVarContextAll|ilent))|n(?:itPluginsDir|st(?:ProgressFlags|Type(?:(?:GetText|SetText))?|all(?:ButtonText|Colors|Dir(?:RegKey)?))|t(?:64(?:CmpU?|Fmt)|CmpU?|Fmt|Op|Ptr(?:CmpU?|Op)))|sWindow)|L(?:angString|icense(?:BkColor|Data|ForceSelection|LangString|Text)|o(?:ad(?:AndSetImage|LanguageFile)|ckWindow|g(?:Set|Text)))|M(?:anifest(?:DPIAware|LongPathAware|MaxVersionTested|SupportedOS)|essageBox|iscButtonText)|N(?:ame|op)|OutFile|P(?:E(?:AddResource|DllCharacteristics|RemoveResource|SubsysVer)|age(?:Callbacks)?|op|ush)|Quit|R(?:MDir|e(?:ad(?:EnvStr|INIStr|Reg(?:DWORD|Str))|boot|gDLL|name|questExecutionLevel|serveFile|turn))|S(?:e(?:archPath|ction(?:Get(?:Flags|InstTypes|Size|Text)|In|Set(?:Flags|InstTypes|Size|Text))|ndMessage|t(?:AutoClose|BrandingImage|C(?:ompress(?:or(?:DictSize)?)?|tlColors|urInstType)|D(?:at(?:ablockOptimize|eSave)|etails(?:Print|View))|Error(?:Level|s)|F(?:ileAttributes|ont)|O(?:utPath|verwrite)|Re(?:bootFlag|gView)|S(?:hellVarContext|ilent)))|how(?:InstDetails|UninstDetails|Window)|ilent(?:Install|UnInstall)|leep|paceTexts|tr(?:C(?:mpS?|py)|Len)|ubCaption)|Un(?:RegDLL|i(?:code|nst(?:Page|all(?:ButtonText|Caption|Icon|SubCaption|Text))))|V(?:I(?:AddVersionKey|FileVersion|ProductVersion)|ar)|W(?:indowIcon|rite(?:INIStr|Reg(?:Bin|DWORD|ExpandStr|MultiStr|None|Str)|Uninstaller))|XPStyle)\b/, token: "keyword"},
            {regex: /^\s*(?:Function|PageEx|Section(?:Group)?)\b/, token: "keyword", indent: true},
            {regex: /^\s*(?:FunctionEnd|PageExEnd|Section(?:End|GroupEnd))\b/, token: "keyword", dedent: true},

            // Command Options
            {regex: /\bNSIS_PROPERTIES_UPPERCASE\b/, token: "atom"},
            {regex: /\bNSIS_PROPERTIES_LOWERCASE\b/, token: "builtin"},

            // LogicLib.nsh
            {regex: /\$\{(?:And(?:If(?:Not)?|Unless)|Break|Case(?:Else)?|Continue|Default|Do(?:Until|While)?|Else(?:If(?:Not)?|Unless)?|End(?:If|Select|Switch)|Exit(?:Do|For|While)|For(?:Each)?|If(?:Cmd|Not(?:Then)?|Then)?|Loop(?:Until|While)?|Or(?:If(?:Not)?|Unless)|Select|Switch|Unless|While)\}/, token: "variable-2", indent: true},

            // FileFunc.nsh
            {regex: /\$\{(?:BannerTrimPath|DirState|DriveSpace|Get(BaseName|Drives|ExeName|ExePath|FileAttributes|FileExt|FileName|FileVersion|Options|OptionsS|Parameters|Parent|Root|Size|Time)|Locate|RefreshShellIcons)\}/, token: "variable-2", dedent: true},

            // Memento.nsh
            {regex: /\$\{(?:Memento(?:Section(?:Done|End|Restore|Save)?|UnselectedSection))\}/, token: "variable-2", dedent: true},

            // TextFunc.nsh
            {regex: /\$\{(?:Config(?:Read|ReadS|Write|WriteS)|File(?:Join|ReadFromEnd|Recode)|Line(?:Find|Read|Sum)|Text(?:Compare|CompareS)|TrimNewLines)\}/, token: "variable-2", dedent: true},

            // WinVer.nsh
            {regex: /\$\{(?:(?:At(?:Least|Most)|Is)(?:ServicePack|Win(?:7|8|10|95|98|200(?:0|3|8(?:R2)?)|ME|NT4|Vista|XP))|Is(?:NT|Server))\}/, token: "variable", dedent: true},

            // WordFunc.nsh
            {regex: /\$\{(?:StrFilterS?|Version(?:Compare|Convert)|Word(?:AddS?|Find(?:(?:2|3)X)?S?|InsertS?|ReplaceS?))\}/, token: "variable-2", dedent: true},

            // x64.nsh
            {regex: /\$\{(?:RunningX64)\}/, token: "variable", dedent: true},
            {regex: /\$\{(?:Disable|Enable)X64FSRedirection\}/, token: "variable-2", dedent: true},

            // Line Comment
            {regex: /(#|;).*/, token: "comment"},

            // Block Comment
            {regex: /\/\*/, token: "comment", next: "comment"},

            // Operator
            {regex: /[-+\/*=<>!]+/, token: "operator"},

            // Variable
            {regex: /\$\w+/, token: "variable"},

            // Constant
            {regex: /\${[\w\.:-]+}/, token: "variable-2"},

            // Language String
            {regex: /\$\([\w\.:-]+\)/, token: "variable-3"}
          ],
          comment: [
            {regex: /.*?\*\//, token: "comment", next: "start"},
            {regex: /.*/, token: "comment"}
          ],
          meta: {
            electricInput: /^\s*((Function|PageEx|Section|Section(Group)?)End|(\!(endif|macroend))|\$\{(End(If|Unless|While)|Loop(Until)|Next)\})$/,
            blockCommentStart: "/*",
            blockCommentEnd: "*/",
            lineComment: ["#", ";"]
          }
        });

        CodeMirror.defineMIME("text/x-nsis", "nsis");

        // Define language
        LanguageManager.defineLanguage("nsis", {
            name: "NSIS",
            mode: "nsis",
            fileExtensions: ["nsh", "nsi", "bnsi", "bnsh", "nsdinc"]
        });
    });

}());
