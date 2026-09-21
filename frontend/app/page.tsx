export default function Home() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Dashboard (skeleton)</h1>
      <p>
        Backend /about.json:{" "}
        <a href="http://localhost:8080/about.json" target="_blank">
          http://localhost:8080/about.json
        </a>
      </p>
    </main>
  );
}
