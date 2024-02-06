let call = null;

export function getActiveUserProfile() {
  if (call === null) {
    call = fetch("/api/me").then((response) => response.json());
  }
  return call;
}
