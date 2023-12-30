# VERifikasi VALidasi Peserta Didik (VerValPD)

VerValPD scraper di NodeJS untuk kebutuhan project/app 3prd party, method yang tersedia saat ini masih sangat-sangat terbatas. Namun, untuk fondasi/pondasi kode dalam autentikasi sudah beres, yang tersisa hanya menambahkan method tambahan untuk scraping.

## Available methods
1. `.findStudent(query: string): Promise<StudentTypes.Student[]>`
2. `.findSekolahId(): Promise<string>`
3. `.login(): Promise<void>`
4. `.saveCookieJar(): Promise<boolean>` - internal purpose
5. `.initCookieJar(): Promise<void>` - internal purpose

## Maintainers
1. [@hansputera](https://github.com/hansputera) - code's owner

## License
MIT