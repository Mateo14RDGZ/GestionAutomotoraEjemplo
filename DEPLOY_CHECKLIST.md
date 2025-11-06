# ✅ Checklist Rápido de Deployment

## Pre-Deployment

- [ ] Código subido a GitHub
- [ ] Cuenta en Vercel creada
- [ ] Cuenta en Neon creada

## Configuración de Base de Datos (Neon)

- [ ] Proyecto creado en Neon
- [ ] Copiada `POSTGRES_PRISMA_URL` (con pgbouncer=true)
- [ ] Copiada `POSTGRES_URL_NON_POOLING` (sin pgbouncer)
- [ ] Base de datos accesible

## Configuración de Vercel

- [ ] Repositorio importado en Vercel
- [ ] Framework Preset: "Other"
- [ ] Build Command: (vacío)
- [ ] Output Directory: (vacío)
- [ ] Install Command: (vacío)

## Variables de Entorno en Vercel

- [ ] `NODE_ENV` = `production`
- [ ] `POSTGRES_PRISMA_URL` = (URL de Neon)
- [ ] `POSTGRES_URL_NON_POOLING` = (URL de Neon)
- [ ] `JWT_SECRET` = (generado con crypto)
- [ ] `FRONTEND_URL` = (URL de Vercel - después del primer deploy)
- [ ] `VITE_API_URL` = `/api`

## Primer Deployment

- [ ] Click en "Deploy"
- [ ] Esperado 2-4 minutos
- [ ] Build exitoso ✅
- [ ] Frontend carga correctamente
- [ ] API responde en `/api/health`

## Post-Deployment

- [ ] Actualizar `FRONTEND_URL` con URL real de Vercel
- [ ] Redeploy después de actualizar FRONTEND_URL
- [ ] Ejecutar `npx prisma db push` localmente
- [ ] Crear usuario administrador inicial
- [ ] Probar login en producción
- [ ] Verificar todas las funcionalidades

## Verificación Final

- [ ] Dashboard muestra estadísticas
- [ ] Puede crear clientes
- [ ] Puede crear autos
- [ ] Puede generar cuotas
- [ ] Puede registrar pagos
- [ ] Exportar PDF funciona
- [ ] Login de cliente funciona
- [ ] No hay errores en consola

## Si Algo Falla

- [ ] Revisar logs en Vercel → Function Logs
- [ ] Verificar variables de entorno
- [ ] Comprobar conexión a Neon
- [ ] Leer sección "Solución de Problemas" en VERCEL_DEPLOY_GUIDE.md
- [ ] Redeploy

---

**Tiempo estimado total: 20-30 minutos**

**¿Todo listo?** 🎉 ¡Tu aplicación está en producción!
