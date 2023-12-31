# VERifikasi VALidasi Peserta Didik (VerValPD)

VerValPD scraper di NodeJS untuk kebutuhan project/app 3prd party, method yang tersedia saat ini masih sangat-sangat terbatas. Namun, untuk fondasi/pondasi kode dalam autentikasi sudah beres, yang tersisa hanya menambahkan method tambahan untuk scraping.

## Available methods
1. `.findStudent(query: string, limit = 100, offset?: number): Promise<StudentTypes.Student[]>`
2. `.findSekolahId(): Promise<string>`
3. `.login(): Promise<void>`
4. `.saveCookieJar(): Promise<boolean>` - internal purpose
5. `.initCookieJar(): Promise<void>` - internal purpose
6. `.findResidu(query: string, limit: number, offset?: number): Promise<StudentTypes.Residu[]>`
7. `.listResidu(limit = 100, offset = 1): Promise<StudentTypes.Residu[]>`

## Maintainers
1. [@hansputera](https://github.com/hansputera) - code's owner

## License
MIT