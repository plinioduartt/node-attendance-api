class GivenInvolvedEndpointNotExistsException extends Error {
  public status: number
  public name: string
    constructor(status: number, message: string) {
        super(message)
        this.status = status
        this.name = 'GivenInvolvedEndpointNotExistsException'
    }

}

export default GivenInvolvedEndpointNotExistsException;