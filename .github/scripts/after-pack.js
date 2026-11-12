// Puts the Smart21network icon and version information into the Windows .exe.
// Pure JavaScript (resedit), so the Windows installer can also be built on Linux or macOS without Wine.
const fs = require('fs'), path = require('path');
exports.default = async function (ctx) {
  if (ctx.electronPlatformName !== 'win32') return;
  const R = require('resedit');
  const exePath = path.join(ctx.appOutDir, ctx.packager.appInfo.productFilename + '.exe');
  const icoPath = path.join(ctx.packager.projectDir, 'build', 'app-icon.ico');
  const exe = R.NtExecutable.from(fs.readFileSync(exePath));
  const res = R.NtExecutableResource.from(exe);
  const ico = R.Data.IconFile.from(fs.readFileSync(icoPath));
  const groups = R.Resource.IconGroupEntry.fromEntries(res.entries);
  const g = groups[0] || { id: 1, lang: 1033 };
  R.Resource.IconGroupEntry.replaceIconsForResource(res.entries, g.id, g.lang, ico.icons.map(i => i.data));
  const info = ctx.packager.appInfo, ver = R.Resource.VersionInfo.fromEntries(res.entries)[0];
  if (ver) {
    const lang = ver.getAllLanguagesForStringValues()[0] || { lang: 1033, codepage: 1200 };
    ver.setStringValues(lang, {
      ProductName: info.productName, FileDescription: info.productName + ' network simulator',
      CompanyName: 'Smart21Brain', LegalCopyright: 'Smart21Brain', OriginalFilename: info.productFilename + '.exe', InternalName: info.productFilename
    });
    const v = String(info.version).split('.').map(x => parseInt(x, 10) || 0); while (v.length < 3) v.push(0);
    ver.setFileVersion(v[0], v[1], v[2], 0, lang.lang); ver.setProductVersion(v[0], v[1], v[2], 0, lang.lang);
    ver.outputToResourceEntries(res.entries);
  }
  res.outputResource(exe);
  fs.writeFileSync(exePath, Buffer.from(exe.generate()));
  console.log('  • icon and version info written to ' + path.basename(exePath));
};
