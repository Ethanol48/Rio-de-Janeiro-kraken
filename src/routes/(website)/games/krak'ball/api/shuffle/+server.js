export function GET() {
  

  const random =Math.floor(Math.random() * 3);

  

  // Si aucune valeur n'est trouvée (improbable)
  return new Response(JSON.stringify({ random }), {
    headers: { 'Content-Type': 'application/json' }
  });
}