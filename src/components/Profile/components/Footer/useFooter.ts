/** Accessible label of the sound toggle. */
const useFooter = (wanted: boolean) => ({
  soundLabel: wanted ? 'Apagar el sonido ambiente' : 'Encender el sonido ambiente',
});

export default useFooter;
