import { entryCodeInjector } from 'rollup-plugin-entry-code-injector';
import retrie from 'retrie';

const injector = entryCodeInjector({
  transformer: code => {
    /**
     * Do some code processing here...
     */

    const NSIS_KEYWORDS = [
      'Abort', 'AddBrandingImage', 'AddSize', 'AllowRootDirInstall', 'AllowSkipFiles', 'AutoCloseWindow',
      'BGFont', 'BGGradient', 'BrandingText', 'BringToFront',
      'Call', 'CallInstDLL', 'Caption', 'ChangeUI', 'CheckBitmap', 'ClearErrors', 'CompletedText', 'ComponentText', 'CopyFiles', 'CRCCheck', 'CreateDirectory', 'CreateFont', 'CreateShortCut',
      'Delete', 'DeleteINISec', 'DeleteINIStr', 'DeleteRegKey', 'DeleteRegValue', 'DetailPrint', 'DetailsButtonText', 'DirText', 'DirVar', 'DirVerify',
      'EnableWindow', 'EnumRegKey', 'EnumRegValue', 'Exch', 'Exec', 'ExecShell', 'ExecShellWait', 'ExecWait', 'ExpandEnvStrings',
      'File', 'FileBufSize', 'FileClose', 'FileErrorText', 'FileOpen', 'FileRead', 'FileReadByte', 'FileReadUTF16LE', 'FileReadWord', 'FileWriteUTF16LE', 'FileSeek', 'FileWrite', 'FileWriteByte', 'FileWriteWord', 'FindClose', 'FindFirst', 'FindNext', 'FindWindow', 'FlushINI',
      'GetCurInstType', 'GetCurrentAddress', 'GetDlgItem', 'GetDLLVersion', 'GetDLLVersionLocal', 'GetErrorLevel', 'GetFileTime', 'GetFileTimeLocal', 'GetFullPathName', 'GetFunctionAddress', 'GetInstDirError', 'GetKnownFolderPath', 'GetLabelAddress', 'GetTempFileName', 'Goto',
      'HideWindow',
      'Icon', 'IfAbort', 'IfErrors', 'IfFileExists', 'IfRebootFlag', 'IfRtlLanguage', 'IfShellVarContextAll', 'IfSilent', 'InitPluginsDir', 'InstallButtonText', 'InstallColors', 'InstallDir', 'InstallDirRegKey', 'InstProgressFlags', 'InstType', 'InstTypeGetText', 'InstTypeSetText', 'Int64Cmp', 'Int64CmpU', 'Int64Fmt', 'IntCmp', 'IntCmpU', 'IntFmt', 'IntOp', 'IntPtrCmp', 'IntPtrCmpU', 'IntPtrOp', 'IsWindow',
      'LangString', 'LicenseBkColor', 'LicenseData', 'LicenseForceSelection', 'LicenseLangString', 'LicenseText', 'LoadAndSetImage', 'LoadLanguageFile', 'LockWindow', 'LogSet', 'LogText',
      'ManifestDPIAware', 'ManifestLongPathAware', 'ManifestMaxVersionTested', 'ManifestSupportedOS', 'MessageBox', 'MiscButtonText',
      'Name', 'Nop',
      'OutFile',
      'Page', 'PageCallbacks', 'PEAddResource', 'PEDllCharacteristics', 'PERemoveResource', 'PESubsysVer', 'Pop', 'Push',
      'Quit',
      'ReadEnvStr', 'ReadINIStr', 'ReadRegDWORD', 'ReadRegStr', 'Reboot', 'RegDLL', 'Rename', 'RequestExecutionLevel', 'ReserveFile', 'Return', 'RMDir',
      'SearchPath', 'SectionGetFlags', 'SectionGetInstTypes', 'SectionGetSize', 'SectionGetText', 'SectionIn', 'SectionSetFlags', 'SectionSetInstTypes', 'SectionSetSize', 'SectionSetText', 'SendMessage', 'SetAutoClose', 'SetBrandingImage', 'SetCompress', 'SetCompressor', 'SetCompressorDictSize', 'SetCtlColors', 'SetCurInstType', 'SetDatablockOptimize', 'SetDateSave', 'SetDetailsPrint', 'SetDetailsView', 'SetErrorLevel', 'SetErrors', 'SetFileAttributes', 'SetFont', 'SetOutPath', 'SetOverwrite', 'SetRebootFlag', 'SetRegView', 'SetShellVarContext', 'SetSilent', 'ShowInstDetails', 'ShowUninstDetails', 'ShowWindow', 'SilentInstall', 'SilentUnInstall', 'Sleep', 'SpaceTexts', 'StrCmp', 'StrCmpS', 'StrCpy', 'StrLen', 'SubCaption',
      'Unicode', 'UninstallButtonText', 'UninstallCaption', 'UninstallIcon', 'UninstallSubCaption', 'UninstallText', 'UninstPage', 'UnRegDLL',
      'Var', 'VIAddVersionKey', 'VIFileVersion', 'VIProductVersion',
      'WindowIcon', 'WriteINIStr', 'WriteRegBin', 'WriteRegDWORD', 'WriteRegExpandStr', 'WriteRegMultiStr', 'WriteRegNone', 'WriteRegStr', 'WriteUninstaller',
      'XPStyle'
    ].sort();
    const NSIS_BLOCKS_START = ['Function', 'Section', 'SectionGroup', 'PageEx'].sort();
    const NSIS_BLOCKS_END = ['FunctionEnd', 'SectionEnd', 'SectionGroupEnd', 'PageExEnd'].sort();
    const NSIS_PROPERTIES = [
      'admin', 'all', 'ARCHIVE', 'auto',
      'both', 'bottom', 'bzip2',
      'colored', 'components','current', 'custom',
      'directory',
      'false', 'FILE_ATTRIBUTE_ARCHIVE', 'FILE_ATTRIBUTE_NORMAL', 'FILE_ATTRIBUTE_OFFLINE', 'FILE_ATTRIBUTE_READONLY', 'FILE_ATTRIBUTE_SYSTEM', 'FILE_ATTRIBUTE_TEMPORARY', 'force',
      'hide', 'highest', 'HKCR', 'HKCR32', 'HKCR64', 'HKCU', 'HKCU32', 'HKCU64', 'HKDD', 'HKEY_CLASSES_ROOT', 'HKEY_CURRENT_CONFIG', 'HKEY_CURRENT_USER', 'HKEY_DYN_DATA', 'HKEY_LOCAL_MACHINE', 'HKEY_PERFORMANCE_DATA', 'HKEY_USERS', 'HKLM', 'HKLM32', 'HKLM64', 'HKPD', 'HKU',
      'IDABORT', 'IDCANCEL', 'IDIGNORE', 'IDNO', 'IDOK', 'IDRETRY', 'IDYES', 'ifdiff', 'ifnewer', 'instfiles',
      'lastused', 'leave', 'left', 'license', 'listonly', 'lzma',
      'MB_ABORTRETRYIGNORE', 'MB_DEFBUTTON1', 'MB_DEFBUTTON2', 'MB_DEFBUTTON3', 'MB_DEFBUTTON4', 'MB_ICONEXCLAMATION', 'MB_ICONINFORMATION', 'MB_ICONQUESTION', 'MB_ICONSTOP', 'MB_OK', 'MB_OKCANCEL', 'MB_RETRYCANCEL', 'MB_RIGHT', 'MB_RTLREADING', 'MB_SETFOREGROUND', 'MB_TOPMOST', 'MB_USERICON', 'MB_YESNO',
      'nevershow', 'none', 'normal', 'notset',
      'off', 'OFFLINE', 'on', 'open',
      'print',
      'READONLY', 'right',
      'SHCTX', 'SHELL_CONTEXT', 'show', 'silent', 'silentlog', 'smooth', 'SYSTEM',
      'TEMPORARY', 'textonly', 'top', 'true', 'try',
      'un.components', 'un.custom', 'un.directory', 'un.instfiles', 'un.license', 'uninstConfirm', 'user',
      'Win10', 'Win7', 'Win8', 'WinVista',
      'zlib'
    ].sort();
    const NSIS_IMPORTANT = [
      '!addincludedir', '!addplugindir', '!appendfile',
      '!cd',
      '!define', '!delfile',
      '!echo',
      '!error', '!execute',
      '!finalize',
      '!getdllversion', '!gettlbversion',
      '!include', '!insertmacro',
      '!makensis',
      '!packhdr', '!pragma',
      '!searchparse', '!searchreplace', '!system',
      '!tempfile',
      '!undef',
      '!verbose',
      '!warning'
    ].sort();
    const NSIS_IMPORTANT_BLOCKS_START = ['!ifdef', '!ifndef', '!if', '!ifmacrodef', '!ifmacrondef', '!macro'].sort();
    const NSIS_IMPORTANT_BLOCKS_END = ['!else', '!endif', '!macroend'].sort();

    console.log();

    return (code
      .replace('%NSIS_BLOCKS_START%', retrie(NSIS_BLOCKS_START))
      .replace('%NSIS_BLOCKS_END%', retrie(NSIS_BLOCKS_END))
      .replace('%NSIS_IMPORTANT_BLOCKS_START%', retrie(NSIS_IMPORTANT_BLOCKS_START))
      .replace('%NSIS_IMPORTANT_BLOCKS_END%', retrie(NSIS_IMPORTANT_BLOCKS_END))
      .replace('%NSIS_IMPORTANT%', retrie(NSIS_IMPORTANT))
      .replace('%NSIS_KEYWORDS%', retrie(NSIS_KEYWORDS))
      .replace('%NSIS_PROPERTIES_LOWERCASE%', retrie(NSIS_PROPERTIES.filter(item => item !== item.toUpperCase())))
      .replace('%NSIS_PROPERTIES_UPPERCASE%', retrie(NSIS_PROPERTIES.filter(item => item === item.toUpperCase())))
    );
  }
});

export default [
  {
    input: 'src/nsis.js',
    output: {
      file: './main.js',
      format: 'iife'
    },
    plugins: [
      injector
    ]
  }
];
