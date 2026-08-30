# Internationalization readiness

Menurio stores language, currency, and time zone at restaurant scope. A restaurant can therefore publish a menu in one market without changing platform-wide settings.

## Supported data model

- Language fields accept canonical [BCP 47](https://www.rfc-editor.org/rfc/bcp/bcp47.txt) tags up to 35 characters, including regional and script variants such as `pt-BR`, `es-419`, and `zh-Hans`.
- Restaurant currency accepts validated ISO 4217 codes and is used when public menu prices are rendered.
- Restaurant time zones accept IANA zone names, such as `Europe/Paris` or `America/Sao_Paulo`.
- The public language selector renders every language enabled for that restaurant. If a platform label has not yet been translated, it falls back to English while restaurant and menu content remains localized.

## Operational guidance

1. Send canonical language tags in `defaultLanguage`, `supportedLanguages`, and translation payloads.
2. Set `currency` and `timezone` while creating or updating the restaurant; current Armenia-oriented defaults remain `AMD` and `Asia/Yerevan` for compatibility.
3. Run migration `0004_internationalization.sql` before allowing long BCP 47 tags in production.
4. Add translated platform UI copy in `src/lib/i18n/public-languages.ts` only when a locale needs labels beyond the English fallback.

Platform subscription prices remain AMD because billing localization and regional tax/payment policy are separate release work.
